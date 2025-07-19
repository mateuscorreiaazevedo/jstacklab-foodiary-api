import { S3Event } from "aws-lambda";
import { record } from "zod";

export async function handler(event: S3Event) {
 await Promise.all(event.Records.map(record => {
  record.s3.object.key
 }))
} 