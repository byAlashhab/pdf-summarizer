import type { Metadata } from "next";
import "./globals.css";
import { auth, signIn, signOut } from "@/config/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookDashedIcon, LogOutIcon } from "lucide-react";
import FormButton from "@/components/FormButton";
import { Toaster } from "@/components/ui/toaster";
import { ABeeZee } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Pdf Summarizer",
};

const font = ABeeZee({ weight: "400", subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  async function logout() {
    "use server";
    await signOut();
  }

  return (
    <html lang="en">
      <body
        className={twMerge("w-screen min-h-screen bg-slate-50", font.className)}
      >
        <nav className="p-6 md:py-8 md:px-20 flex justify-between items-center">
          <h1 className="flex items-center gap-1">
            <span className="font-semibold text-roody">PDF </span>
            <span>Summarizer</span>
            <BookDashedIcon />
          </h1>
          {session?.user ? (
            <div className="flex items-center">
              <FormButton action={logout} element={<LogOutIcon />} />
              <Image
                src={session.user.image ?? ""}
                className="w-10 h-10 rounded-full"
                alt=""
                width={40}
                height={40}
              />
            </div>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button
                variant="outline"
                type="submit"
                className="flex items-center font-semibold gap-0 h-[40px] p-0 pl-3"
              >
                SignIn
                <Image src={"/google.png"} alt="google icon" width={40} height={40} />
              </Button>
            </form>
          )}
        </nav>

        {session?.user ? (
          children
        ) : (
          <div className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center gap-3">
            <Image src={"/sleeping.png"} alt="" width={100} height={100} />
            <p className="text-base">Sign in to continue 🤸‍♂️</p>
          </div>
        )}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
