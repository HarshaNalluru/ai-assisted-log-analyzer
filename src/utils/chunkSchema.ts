
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export interface ChunkResponse {
    chunk_range: [number, number];
    purpose: string;
    details: string[];
}

export const chunk_response_format = zodResponseFormat(z.object({
    chunks: z.array(
        z.object({
            chunk_range: z.array(z.number()).describe("The start and end line numbers for the chunk"),
            purpose: z.string().describe("High level reasoning for the chunk"),
            details: z.array(z.string()).describe("Array of sentences denoting details"),
        })
    ),
}), "chunk_response_format");