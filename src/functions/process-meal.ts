import type { SQSEvent } from "aws-lambda";
import { record } from "zod";
import { ProcessMeal } from "../queues/process-meal";

export async function handler(event: SQSEvent) {
    await Promise.all(event.Records.map(async record => {
      const data = JSON.parse(record.body)
      await ProcessMeal.process(data)
    }))
}
