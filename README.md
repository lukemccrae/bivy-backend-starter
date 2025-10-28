# Bivy Backend Starter

A minimal AWS CDK + Lambda starter project for receiving and handling webhooks / device payloads from a Bivy Stick device.

![bivy stick](https://i.imgur.com/BELojZj.png "Bivy Stick")

This repository provides a tiny example stack that deploys:
- A Node.js Lambda function (handler exported as `index.handler`)
- An API Gateway REST API proxying requests to the Lambda
- A basic IAM role for the Lambda

(Repository-based details: lib/bivy-backend-starter-stack.ts and src/bivyWebhookLambda/handler.ts.)

What this starter is for
- Give developers a simple, deployable backend to accept Bivy Stick webhook payloads.
- Show a minimal pattern for parsing incoming JSON, identifying Bivy "location" events, and placing a single place to add processing logic (store to DB, forward to other services, publish events, etc).

Architecture (what's included)
- AWS CDK v2 stack that creates:
  - Lambda (Node.js 22.x) whose code is read from `src/lambdas/bivyWebhookLambda/dist`
  - API Gateway REST API in proxy mode to route requests to the Lambda
  - An IAM role assumed by the Lambda
- Lambda handler:
  - Parses request body JSON
  - Detects Bivy location events when payload contains `IMEI`, `type === 'location'`, and `lat`/`lng`
  - Returns 200 on success, 400 for unknown formats, 500 on errors

How it integrates with a Bivy Stick
- The Bivy Stick (or associated service) posts JSON webhooks to the API Gateway endpoint created by this stack.
- The Lambda inspects the payload and, for recognized Bivy location events, extracts IMEI, latitude, longitude, elevation and timestamp so you can:
  - Persist locations to a datastore
  - Trigger notifications or alerts
  - Enrich and forward data to mapping/analytics systems

Device data / notes (sourced from provided device description)
- The Bivy Stick is a satellite communicator using the Iridium network with features such as:
  - Global satellite coverage
  - Dedicated phone number / messaging (app-to-app, SMS, email)
  - GPS tracking / location sharing and SOS/emergency response
  - GroupTrack support and rugged design (waterproof, long battery life)
- Typical location payloads include fields like IMEI, type (e.g. "location"), lat, lng, elevation, and time.

Quick start
1. Build your Lambda artifact and place compiled JS at:
   `src/lambdas/bivyWebhookLambda/dist/index.js` (exporting `handler`)
2. Bootstrap and deploy the CDK stack:
   - cdk bootstrap
   - cdk deploy
3. Send a test POST with a JSON body containing IMEI, type, lat, lng to the API endpoint.

Where to customize
- Add your processing logic in `src/bivyWebhookLambda/handler.ts` in the BIVY case block.
- Adjust IAM permissions in `lib/bivy-backend-starter-stack.ts` to grant least privilege for any AWS services the Lambda needs.

