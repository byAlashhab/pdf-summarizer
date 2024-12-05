import { NextResponse } from "next/server";
//@ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";
import { auth } from "@/config/auth";

export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {

    const { file } = await req.json();

    if (!file) {
      return new NextResponse("missing data", { status: 400 });
    }

    const buffer = Buffer.from(file, "base64");
    const { text } = await pdf(buffer);

    return NextResponse.json({ text });
  } catch (err) {
    console.log(err);
    return new NextResponse("server error", { status: 500 });
  }
});
