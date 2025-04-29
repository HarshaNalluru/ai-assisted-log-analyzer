/**
 * This file contains functions to analyze log data and generate insights.
 * In a real-world application, these functions would likely call an LLM API,
 * but for this demo, we'll use mock implementations.
 */

interface LogInsight {
    summary: string;
    details: InsightItem[];
}

export interface InsightItem {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp?: string;
}

/**
 * Parses a log file and extracts insights
 * This is a mock implementation - in a real system this would call an LLM API
 */
export const analyzeLogFile = (logContent: string): LogInsight => {
    const lines = logContent.split('\n');
    const insightItems: InsightItem[] = [];

    // Count message types
    let infoCount = 0;
    let warnCount = 0;
    let errorCount = 0;

    // Count processed messages
    let messagesProcessed = 0;
    let messagesFailed = 0;

    // Track network issues
    let networkIssues = false;

    // Parse logs
    lines.forEach(line => {
        if (line.includes('INFO')) infoCount++;
        if (line.includes('WARN')) warnCount++;
        if (line.includes('ERROR')) errorCount++;

        if (line.includes('Message processed successfully')) messagesProcessed++;
        if (line.includes('Failed to process message')) messagesFailed++;

        if (line.includes('Network latency spike detected')) {
            networkIssues = true;
            const timestamp = line.match(/\[(.*?)\]/)?.[1] || '';
            insightItems.push({
                type: 'warning',
                message: 'Network latency spike detected, which may have caused message processing delays',
                timestamp,
            });
        }

        if (line.includes('Message processing failed after retry')) {
            const msgId = line.match(/msg-\d+/)?.[0] || 'unknown';
            const timestamp = line.match(/\[(.*?)\]/)?.[1] || '';
            insightItems.push({
                type: 'error',
                message: `Message ${msgId} failed processing even after retry and was sent to the dead letter queue`,
                timestamp,
            });
        }

        if (line.includes('Channel flow control activated')) {
            const timestamp = line.match(/\[(.*?)\]/)?.[1] || '';
            insightItems.push({
                type: 'info',
                message: 'Flow control was temporarily activated, indicating the consumer was not keeping up with message rate',
                timestamp,
            });
        }
    });

    // Add summary items
    if (messagesProcessed > 0) {
        insightItems.push({
            type: 'success',
            message: `Successfully processed ${messagesProcessed} messages`,
        });
    }

    // Create summary
    const summary = `This log contains ${lines.length} entries (${infoCount} info, ${warnCount} warnings, ${errorCount} errors). ` +
        `${messagesProcessed} messages were successfully processed and ${messagesFailed} failed. ` +
        `${networkIssues ? 'Network instability was detected during this period.' : 'No network issues were detected.'}`;

    return {
        summary,
        details: insightItems,
    };
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
