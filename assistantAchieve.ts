import OpenAI from "openai";
import dotenv from 'dotenv';
import * as readline from 'readline';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function createAssistantName (){
    const assistant = await openai.beta.assistants.create({
        instructions:"You are a chat bot. There are four name pairs. User input any of name from list, output the correspoding name pair. If not found, say so.",
        model: "gpt-4-turbo-preview",
        tools:[{
            "type": "retrieval"
        }]
    })
    return assistant;
}

async function handleFunctioncall() {
    const assistant = await createAssistantName();
    const create = await createThread(assistant.id);
}

async function createThread(assistantId: string) {
    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: 'user',
            content: 'Annie Lee'
        }
    )
    console.log('Thread created:', thread);
    console.log('Message sent:', message);
    addMessage(thread.id, assistantId);
    console.log('Thread id check', thread.id);
    console.log('Message sent cpmplete');
}

async function addMessage(threadId: string, assistantId: string) {
    let runStatus = 'in_progress';

    const run = await openai.beta.threads.runs.create(
        threadId,
        {
            assistant_id: assistantId,
            instructions: ` This is the name pair, "David Smith": "大卫 斯密斯",
            "Yueling Zhang": "月林张",
            "Huawen Wu": "华文吴",
            "Annie Lee": "李安妮". If user inputs key, output whole pair. If user inputs value, output whole pair`
        }
    )

    if(!run.id) {
        console.log('Failed to create run.');
        return;
    }

    while (run.status !== 'completed') {
        try {

            const userInput = await readInLine('Please enter a name: ');
            console.log('user intput: ' + userInput);
            console.log(userInput);
            const mesage = await openai.beta.threads.messages.create(
                threadId,
                {
                    role: 'user',
                    content: userInput
                }
            )

            const threadMessages = await openai.beta.threads.messages.list(
                threadId
              );
            
              console.log(JSON.stringify(threadMessages.data, null, 2));

        } catch (error) {
            
        }
    }
}

const readInLine = async(prompt: string) : Promise<string> => {
    
    // 创建 readline.Interface 实例
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // 返回一个 Promise，当用户输入后解决
    return new Promise(resolve => {
        rl.question(prompt, (answer: string) => {
            rl.close(); // 关闭 readline.Interface 实例
            resolve(answer); // 解决 Promise，返回用户的输入
        });
    });

   
}

handleFunctioncall();