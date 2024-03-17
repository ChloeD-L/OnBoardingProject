import OpenAI from "openai";
import dotenv from 'dotenv';
import Express from 'express';
import * as readline from 'readline';
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = Express();
const port = process.env.PORT || 3000; // Specify a port
app.use(Express.json()); 


function getNamePair(name: string): string {
    // Name pair
    const namePairs: {[key: string]: string} = {
        "David Smith": "大卫 斯密斯",
        "Yueling Zhang": "月林张",
        "Huawen Wu": "华文吴",
        "Annie Lee": "李安妮",
        "大卫 斯密斯": "David Smith",
        "月林张": "Yueling Zhang",
        "华文吴": "Huawen Wu",
        "李安妮": "Annie Lee"
    };

    const matchedName = namePairs[name] || "Unknown";

    return matchedName === "Unknown" ? "Unknown" : `${name} ${matchedName}`;
}

// Create readline.Interface Object
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Chat loop define
async function startInteractiveLoop(): Promise<void> {
    // Use promise to handle concurrency
    while (true) { 
      const userInput: string = await new Promise<string>(resolve => {
        rl.question('Please enter a name, or type "End" to exit:', (answer: string) => {
          resolve(answer);
        });
      });
  
      // Check if user ends the conversition
      if (userInput.toLowerCase() === 'end') {
        console.log('Chat ends');
        rl.close(); 
        break; 
      };

      const responseMessage = await runConversation(userInput);
      console.log(responseMessage);

    }
  }
  

// Program start here
startInteractiveLoop();


const runConversation = async (name:string) : Promise<ChatCompletion.Choice['message']> =>{
    const messages: ChatCompletionMessageParam[] =[
        {role:"user", content: name},
        {role:"system", content: "You can just reply user name pair in json format without making it a sentence."}
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
        response_format: { type: "json_object" },
    });

    const responseMessage = response.choices[0].message;

    // console.log(responseMessage);

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

        // console.log("messages - before second response:" ,messages);

        // console.log("responseMessage - before second response",responseMessage);

        const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: messages,
            // response_format: { type: "json_object" },
        });

        // console.log("messages:" ,messages);

        // console.log("responseMessage: ",secondResponse.choices[0].message);

        return secondResponse.choices[0].message;
    }

    return responseMessage;

}

// // 创建一个新的路由来处理 POST 请求
// app.post('/conversation', async (req, res) => {
//     const { name } = req.body;
//     try {
//         const conversationResponse = await runConversation(name);
//         res.json(conversationResponse);
//     } catch (error) {
//         // 类型检查
//         if (error instanceof Error) {
//             res.status(500).json({ error: error.message });
//         } else {
//             // 处理非 Error 类型的错误
//             res.status(500).json({ error: 'An unknown error occurred' });
//         }
//     }
// });


// // 启动服务器
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });