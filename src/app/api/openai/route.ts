import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/config/auth";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "edge";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 d"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  //rate limiting
  const identifier =
    req.auth.user?.id || req.headers.get("x-forwarded-for") || "anonymous";

  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      {
        message: "Rate limit exceeded. Please try again tomorrow.",
      },
      { status: 429 }
    );
  }

  const { pdfText, message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct-v0.1",
    messages: [
      {
        role: "system",
        content: `you are an ai assistant that should asnwer the questions regarding this pdf content: "${pdfText}"`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.5,
    top_p: 1,
    max_tokens: 1024,
  });

  return NextResponse.json(completion.choices[0].message);
});
