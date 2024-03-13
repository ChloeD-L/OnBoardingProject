import OpenAI from "openai";
import dotenv from 'dotenv';
import { ChatCompletionMessageParam } from "openai/resources";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


function getNamePair(name: string): string {
    // 名字对列表
    const namePairs: {[key: string]: string} = {
        "David Smith": "大卫 斯密斯",
        "Yueling Zhang": "月林张",
        "Huawen Wu": "华文吴",
        "Annie Lee": "李安妮",
        // 加入反向映射以便双向查询
        "大卫 斯密斯": "David Smith",
        "月林张": "Yueling Zhang",
        "华文吴": "Huawen Wu",
        "李安妮": "Annie Lee"
    };

    // 直接通过属性访问方式来获取匹配的名字
    const matchedName = namePairs[name] || "Unknown";

    // 返回格式化后的字符串
    return matchedName === "Unknown" ? "Unknown" : `${name} ${matchedName}`;
}

// 测试函数
console.log(getNamePair("David Smith")); // 应返回 "David Smith 大卫 斯密斯"
console.log(getNamePair("月林张")); // 应返回 "月林张 Yueling Zhang"
console.log(getNamePair("Someone")); // 应返回 "Unknown"

async function runConversation(name: string) {
    const messages: ChatCompletionMessageParam[] =[
        {role:"user", content: name},
    ];
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
            type: "function",
            function : {
                name: "get_name_pair",
                description: "Get name pair according to user's input",
                parameters: {
                    type: "object",
                    properties : {
                        name: {
                            type: "string",
                            description: "Chinese name or English name, e.g. David Smith, 大卫 斯密斯"
                        }
                    },
                    required: ["name"],
                },

            }
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: messages,
        tools: tools,
        tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    console.log(responseMessage);

    const toolCalls = responseMessage.tool_calls;
    if (toolCalls) {

        const availableFunctions = {
            get_name_pair: getNamePair,
        };
        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            if (functionName != "get_name_pair") {
                throw new Error("invalid name")
            }
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = functionToCall(
                functionArgs.name
            );

            messages.push({
                tool_call_id:toolCall.id,
                role: "tool",
                content: functionResponse,
            });
        }

        const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: messages,
        });
        return secondResponse.choices;
    }

    console.log(responseMessage);

    return ;

}

runConversation("David Smith").then(console.log).catch(console.error);
