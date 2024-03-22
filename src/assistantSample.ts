import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

import Configuration from 'openai';
import CreateAssistantRequestTool from 'openai';


async function createAssistant() {
    const assistant = await openai.beta.assistants.create({
        instructions: "You are a weather bot. Use the provided functions to answer questions.",
        model: "gpt-4-turbo-preview",
        tools: [{
            type: "function",
            function: {
                name: "getCurrentWeather",
                description: "Get the weather in location",
                parameters: {
                    type: "object",
                    properties: {
                        location: { type: "string", description: "The city and state e.g. San Francisco, CA" },
                        unit: { type: "string", enum: ["c", "f"] }
                    },
                    required: ["location"]
                }
            }
        }, {
            type: "function",
            function: {
                name: "getNickname",
                description: "Get the nickname of a city",
                parameters: {
                    type: "object",
                    properties: {
                        location: { type: "string", description: "The city and state e.g. San Francisco, CA" },
                    },
                    required: ["location"]
                }
            }
        }]
    });
    return assistant;
}


async function handleFunctionCalls(threadId: string, runId: string, callIds: string[]) {
    // 模拟函数输出
    const toolOutputs = [
        {
            tool_call_id: callIds[0], // 假设这是 getCurrentWeather 的调用ID
            output: JSON.stringify({ temperature: "22C" }), // 假设的天气输出
        },
        {
            tool_call_id: callIds[1], // 假设这是 getNickname 的调用ID
            output: JSON.stringify({ nickname: "LA" }), // 假设的昵称输出
        },
    ];

    // 提交工具函数的输出
    const run = await openai.beta.threads.runs.submitToolOutputs(
        threadId,
        runId,
        { tool_outputs: toolOutputs }
    );

    return run;
}


async function main() {
    const threadId = 'your_thread_id'; // 替换为实际的 threadId
    const runId = 'your_run_id'; // 替换为实际的 runId
    const toolCallIds = ['your_tool_call_id_1', 'your_tool_call_id_2']; // 替换为实际的 tool call IDs

    try {
        // 创建助手（如果需要）
        const assistant = await createAssistant();
        console.log(`Assistant Created: ${assistant.id}`); // 确保这里使用正确的属性访问 ID

        // 处理工具函数的输出
        const result = await handleFunctionCalls(threadId, runId, toolCallIds);
        console.log('Tool outputs submitted:', result);

        // 检索更新后的运行状态
        const updatedRun = await openai.beta.threads.runs.retrieve(
            threadId,
            runId
        );

        console.log('Updated Run:', updatedRun);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


main().catch(console.error);