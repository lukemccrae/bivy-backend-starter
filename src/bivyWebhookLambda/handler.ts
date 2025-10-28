import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let payload;
    if (typeof event.body === 'string') {
      payload = JSON.parse(event.body);
    } else {
      payload = event.body;
    }

    // Identify type
    let eventType: 'BIVY' | 'UNKNOWN';
    if (
      payload.IMEI &&
      payload.type === 'location' &&
      payload.lat &&
      payload.lng
    ) {
      eventType = 'BIVY';
    } else {
      eventType = 'UNKNOWN';
    }

    switch (eventType) {
      case 'BIVY': {
        const lat = String(payload.lat);
        const long = String(payload.lng);
        const altitude = payload.elevation ? String(payload.elevation) : '0';
        const timestamp = String(payload.time);
        const imei = payload.IMEI;
        console.log(imei, '<< imei');
        if (!imei) throw new Error('No IMEI in bivy payload');

        // do stuff with bivy data

        break;
      }

      case 'UNKNOWN': {
        console.error('Unknown event format', payload);
        return { statusCode: 400, body: 'Unknown event format' };
      }
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Handler error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
