import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
  
export class HelloWorld extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const helloFunction = new NodejsFunction(this, 'function', {
      entry: path.join(__dirname, 'name-pair.function.ts'), // 指定Lambda入口文件
    });
    new LambdaRestApi(this, 'apigw', {
      handler: helloFunction,
    });
  }
}