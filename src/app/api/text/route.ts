import { NextRequest, NextResponse } from "next/server";
//@ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";

export async function POST(req: NextRequest) {
  const { file } = await req.json();

  if (!file) {
    return new NextResponse("Error", { status: 400 });
  }

  try {
    const buffer = Buffer.from(file, "base64");
    const { text } = await pdf(buffer);

    return NextResponse.json({ text });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}
