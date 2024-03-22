import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HelloWorld } from './name-pair'; 

export class MyCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new HelloWorld(this, 'MyNamePair');

        // // 定义一个 Lambda 函数
        // const myLambda = new lambda.Function(this, 'MyLambda', {
        //     runtime: lambda.Runtime.NODEJS_14_X,
        //     code: lambda.Code.fromAsset('lambda'), // 确保这指向包含你的 TypeScript 文件的目录
        //     handler: 'handler.handler', // 注意这里改成了 handler.handler
        //     memorySize: 128
        // });

        // // 定义一个 API Gateway，并将其连接到 Lambda 函数
        // new apigateway.LambdaRestApi(this, 'MyApi', {
        //     handler: myLambda
        // });
    }
}
