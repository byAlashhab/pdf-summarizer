"use client";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader, SendIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "./ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";


type message = {
  role: "user" | "assistant";
  content: string;
};



function Chat({ file, fileString }: { file: string; fileString: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<message[]>([]);
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function send(e: FormEvent) {
    e.preventDefault();

    if (!message) return;
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    const res = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfText: fileString, message }),
      credentials: "include",
    });

    const resDa = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: resDa.message,
      });

      setMessage("");
      setLoading(false);
      return;
    }

    setChatMessages((prev) => [...prev, resDa]);
    setMessage("");
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
      className="translate-y-6 lg:translate-y-0 absolute inset-0 m-auto w-4/5 lg:w-[900px] h-[500px] rounded-lg flex p-2 shadow-lg bg-white"
    >
      <div className="w-1/2 bg-white rounded-lg p-2 hidden lg:block">
        <iframe
          src={`${file}#toolbar=0`}
          className="w-full h-full rounded-lg"
          title="PDF Viewer"
        />
      </div>
      <div className="w-full lg:w-1/2 rounded-lg p-2 flex flex-col gap-2">
        <div className="flex-1 bg-slate-100 rounded-lg p-2 flex flex-col text-sm gap-2 overflow-auto relative">
          <AnimatePresence>
            {chatMessages.length === 0 && (
              <motion.img
                src={"/pdf.svg"}
                width={40}
                height={40}
                alt="pdf icon"
                className="absolute inset-0 m-auto"
                exit={{ y: -20, opacity: 0, transition: { duration: 0.3 } }}
              />
            )}
          </AnimatePresence>

          {chatMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.4, type: "spring" },
              }}
              className={twMerge(
                "bg-white px-3 py-2 rounded-lg w-fit max-w-[85%] shadow-md",
                message.role === "user" ? "self-end" : "self-start"
              )}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm max-w-none dark:prose-invert"
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        {...props}
                        className={`${"block bg-gray-800 text-white p-2 rounded"}`}
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </motion.div>
          ))}
          {loading && <Skeleton className="w-[60%] h-[30px] rounded-lg" />}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex gap-2 mt-2" onSubmit={send}>
          <Input
            placeholder="Chat with your pdf"
            disabled={loading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="bg-roody hover:bg-red-600" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <SendIcon />}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default Chat;
