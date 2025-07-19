import z from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
})

export const envConfig = schema.parse(process.env)