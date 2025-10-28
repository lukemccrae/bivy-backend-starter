import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';


export class BivyBackendStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bivyWebhookLambdaRole = new iam.Role(
      this,
      'BivyWebhookLambdaRole',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
      }
    );

    const bivyWebhookLambda = new lambda.Function(
      this,
      'BivyWebhookLambda',
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset('src/lambdas/bivyWebhookLambda/dist'),
        timeout: cdk.Duration.seconds(30),
        role: bivyWebhookLambdaRole,
      }
    );

    // API Gateway REST API
    new apigw.LambdaRestApi(this, 'BivyApi', {
      handler: bivyWebhookLambda,
      description: 'Starter API for Bivy device integrations',
      proxy: true,
    });
  }
}
