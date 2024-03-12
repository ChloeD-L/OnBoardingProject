import OpenAI from "openai";
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
    const thread = await openai.beta.threads.create();
    const runId = await chatRound(thread.id);
    const messages = await openai.beta.threads.messages.list(
        thread.id
    );
    console.log("message",JSON.stringify(messages.data, null, 2));
}  

const chatRound = async (threadId: string) : Promise<string> => {

    let userInput: string = await readInLine("Please enter your input: ") ;

    const message = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: userInput
        }
    )

    const run = await openai.beta.threads.runs.create(threadId,
        {
            assistant_id: 'asst_ezbT3Y0mRhQ3ORHeS7gC6CsJ'
        });

    console.log('Start waiting...');
    await new Promise(resolve => setTimeout(resolve, 9000));
    console.log('Finished waiting.');

    return run.id;
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