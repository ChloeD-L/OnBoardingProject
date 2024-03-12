import OpenAI from "openai";
import dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {

    const assistant = await openai.beta.assistants.create({
        name: "Name Pair bot",
        instructions: `You are a chat bot. There are four name pairs. 
        User input any of name from list, output the whole correspoding name pair. If not found, say so.

        name pair:
        "David Smith": "大卫 斯密斯",
        "Yueling Zhang": "月林张",
        "Huawen Wu": "华文吴",
        "Annie Lee": "李安妮"`,
        model: "gpt-4-turbo-preview",
        tools: [
            {
                type: "retrieval"
            }
        ]
    })

    const thread = await openai.beta.threads.create();


    let isStop: boolean = false;

    console.log("Enter over when you want to stop.");

    while (!isStop) {
        let userInput: string = await readInLine("Please enter your input: ") ;
        if (userInput.toLocaleLowerCase() === "over") {
            isStop = true;
        };
        const runId = await chatRound(assistant.id, thread.id, userInput);
        const runSteps = await openai.beta.threads.runs.steps.list(
            thread.id,
            runId
        );
        // console.log(runSteps);

        const messages = await openai.beta.threads.messages.list(
            thread.id
        );
        console.log("message",JSON.stringify(messages.data, null, 2));
    };

    

}  

const chatRound = async (assistantId: string, threadId: string, userInput: string) : Promise<string> => {
    const message = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: userInput
        }
    )

    const run = await openai.beta.threads.runs.create(threadId,
        {
            assistant_id: assistantId
        });

    console.log('Start waiting...');
    await new Promise(resolve => setTimeout(resolve, 9000));
    console.log('Finished waiting.');

    return run.id;
}

const readInLine = async(prompt: string) : Promise<string> => {
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(prompt, (answer: string) => {
            rl.close(); 
            resolve(answer); 
        });
    });

   
}

main().catch(console.error);