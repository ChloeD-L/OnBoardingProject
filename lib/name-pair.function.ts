// lambda/handler.ts
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {runConversation} from "../src/chatCompleteAchieve";

// Lambda 函数处理器
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // parse request body
        const name = event.queryStringParameters?.name;
        
        console.log(name);
        console.log("1111")
        let response;
        
        switch (event.httpMethod) {
        case 'GET':
        case 'ANY':
            response = {
            statusCode: 200,
            // headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'assistant', content: 'Yueling Zhang: 月林张', name: name}),
            };
            break;
        // Add more cases here as needed
        }

        if (!response) {
            response = {
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad Request' })
            };
        }
    
        return response;
      } catch (error) {
      console.log("error", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
};
