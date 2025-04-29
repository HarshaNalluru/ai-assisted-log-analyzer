import { AzureKeyCredential } from "@azure/core-auth";
import getClient, { isUnexpected } from "@azure-rest/ai-inference";
import { chunk_response_format, ChunkResponse } from "./chunkSchema";

export interface ChunkGroup {
    chunkIndex: number;
    chunkRange: [number, number];
    subchunks: ChunkResponse[];
}

export interface LogInsight {
    summary: string;
    details: ChunkGroup[];
}

const azureOpenAIEndpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT || "";
const azureOpenAIKey = process.env.REACT_APP_AZURE_OPENAI_KEY || "";

/**
 * Parses a log file and extracts structured insights using OpenAI
 * Chunks the log and asks OpenAI to summarize each chunk and its purpose
 */
export const analyzeLogFile = async (logContent: string): Promise<LogInsight> => {
    const inferenceClient = getClient(
        azureOpenAIEndpoint,
        new AzureKeyCredential(azureOpenAIKey),
        { apiVersion: "2025-03-01-preview" }
    );
    // Split log into chunks of ~50 lines for context
    const lines = logContent.split('\n');
    const chunkSize = 400;
    const chunks: string[] = [];
    for (let i = 0; i < lines.length; i += chunkSize) {
        chunks.push(lines.slice(i, i + chunkSize).join('\n'));
    }

    // Prepare prompt for each chunk
    const chunkSummaries: { chunkIndex: number, chunkRange: [number, number], subchunks: ChunkResponse[] }[] = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkRange: [number, number] = [i * chunkSize + 1, Math.min((i + 1) * chunkSize, lines.length)];
        const prompt = `You are an expert at analyzing Azure SDK and rhea logs.\n\nGiven the following logs, identify logical chunks and describe what is being attempted or achieved in each of those chunks, and summarize any errors, warnings, or important events.\nLog chunk (lines ${chunkRange[0]}-${chunkRange[1]}):\n${chunk}`;
        try {
            const completion = await inferenceClient.path("/chat/completions").post({
                body: {
                    model: "gpt-4.1",
                    messages: [
                        { role: "system", content: "You are a helpful assistant for log analysis." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2,
                    max_tokens: 10000,
                    response_format: chunk_response_format,
                }
            });

            if (isUnexpected(completion)) {
                console.error(`Unexpected response here: ${completion.status} - ${JSON.stringify(completion.body)} `);
                throw new Error(`Unexpected response from OpenAI API: ${completion.status} - ${completion.body}`);
            }

            const summary = completion.body.choices[0]?.message?.content || "No analysis provided.";
            const parsed = JSON.parse(summary);
            let subchunks: ChunkResponse[] = [];
            if (Array.isArray(parsed)) {
                subchunks = parsed;
            } else if (parsed && Array.isArray(parsed.chunks)) {
                subchunks = parsed.chunks;
            } else {
                console.warn("Unexpected format from OpenAI response", parsed);
            }
            chunkSummaries.push({ chunkIndex: i, chunkRange, subchunks });
        } catch (e) {
            throw Error(`${chunk}: "error" ${e}`);
        }
    }

    // Aggregate summaries
    const summary = `Log analyzed in ${chunks.length} chunks. Each chunk summarizes what is being attempted and key events.`;
    return { summary, details: chunkSummaries };
};

/**
 * Processes a user query against log data
 * In a real application, this would use an LLM for natural language Q&A
 */
export const processLogQuery = (query: string, logContent: string): string => {
    // This is a simple mock implementation
    if (query.toLowerCase().includes('failed')) {
        return "There were message processing failures for message ID msg-003 with error 'Invalid event type'. The message failed even after retry and was sent to the dead letter queue.";
    }

    if (query.toLowerCase().includes('network')) {
        return "There was a network latency spike at 12:00:19, reaching 450ms (above the 200ms threshold). The network returned to normal at 12:00:25.";
    }

    if (query.toLowerCase().includes('processed') || query.toLowerCase().includes('success')) {
        return "3 messages were successfully processed: msg-001, msg-002, and msg-004.";
    }

    return "I couldn't find a specific answer to your query. Try asking about network issues, message failures, or processing successes.";
};
