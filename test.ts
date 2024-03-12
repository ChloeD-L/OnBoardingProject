import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    // const assistant = await openai.beta.assistants.create({
    //     name: "Econonics Tutor",
    //     instructions: "You are an economics tutor",
    //     tools: [
    //         {
    //             type: "code_interpreter"
    //         }
    //     ],
    //     model : "gpt-4-turbo-preview"
    // });
    
    // console.log(assistant);

    // const thread = await openai.beta.threads.create();
    // console.log(thread);

    const threadID:string = "thread_Y6e0kgsSYU2i0yYheCMtFFVp";

    // Create Message
    const message = await openai.beta.threads.messages.create(threadID
    ,{
        role:"user",
        content:"What is 800*500"
    });

    // run.status == "in_progress"; 

    const run = await openai.beta.threads.runs.create(threadID,
    {
        assistant_id: 'asst_cWVqYPOlkWVeaMAjoyU9cwCC',
        instructions: "Address the user as Leon"
    });

    console.log('Start waiting...');
    await new Promise(resolve => setTimeout(resolve, 9000));
    console.log('Finished waiting.');

    

    console.log("run:", run);

    const runRetrive = await openai.beta.threads.runs.retrieve(
        threadID,
        run.id);

    console.log(runRetrive);

    const messages = await openai.beta.threads.messages.list(
        threadID
    );

    // // messages.body.data.forEach((message) => {

    // // });

    console.log("message",JSON.stringify(messages.data, null, 2));

    // console.log(messages);

    const logs = await openai.beta.threads.runs.list(
        threadID
    )

//     console.log(logs);
    console.log( "run log:", logs);

    console.log("run:", run);
}

async function check() {
    const runSteps = await openai.beta.threads.runs.steps.list(
        "thread_Y6e0kgsSYU2i0yYheCMtFFVp",
        "run_rhgV71O967uI7hpRJwsWPu0o"
    );

    console.log(runSteps);

    const messages = await openai.beta.threads.messages.list(
        "thread_Y6e0kgsSYU2i0yYheCMtFFVp"
    );

    // // messages.body.data.forEach((message) => {

    // // });

    console.log("message",JSON.stringify(messages.data, null, 2));
}

main().catch(console.error);
check().catch(console.error);

