// lambda/handler.ts
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {runConversation} from "../src/chatCompleteAchieve";

// Lambda 函数处理器
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // // 解析输入
    // const name = event.body ? JSON.parse(event.body).name : '';

    // // 使用 getNamePair 函数获取名称配对
    // const responseMessage =  await runConversation(name);

    // // 返回 Lambda 响应
    // return {
    //     statusCode: 200,
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(
    //         // { message: responseMessage }
    //         {message: 'hello world'}
    //         ),
    // };

    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hello world',
        }),
    };
};