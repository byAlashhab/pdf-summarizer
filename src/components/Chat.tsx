import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader, SendIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { Skeleton } from "./ui/skeleton";

type message = {
  role: "user" | "assistant";
  content: string;
};

function Chat({ file }: { file: string }) {
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<message[]>([
    { role: "user", content: "test" },
    { role: "assistant", content: "hi,test how can i help you?" },
  ]);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
      className="absolute inset-0 m-auto w-[900px] h-[500px] rounded-lg flex p-2 shadow-lg bg-white"
    >
      <div className="w-1/2 bg-white rounded-lg p-2">
        <iframe
          src={`${file}#toolbar=0`}
          className="w-full h-full rounded-lg"
          title="PDF Viewer"
        />
      </div>
      <div className="w-1/2 rounded-lg p-2 flex flex-col gap-2">
        <div className="flex-1 bg-slate-100 rounded-lg p-2 flex flex-col text-sm gap-2 overflow-auto ">
          {chatMessages.map((message) => (
            <motion.p
              key={nanoid()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
              className={twMerge(
                "bg-white p-2 rounded-lg w-fit max-w-[85%] shadow-md",
                message.role === "user" ? "self-end" : "self-start"
              )}
            >
              {message.content}
            </motion.p>
          ))}
          {loading && <Skeleton className="w-[60%] h-[30px] rounded-lg" />}
        </div>
        <form action="" className="flex gap-2">
          <Input placeholder="Chat with your pdf" disabled={loading} />
          <Button className="bg-roody hover:bg-red-600" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <SendIcon />}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}

export default Chat;
