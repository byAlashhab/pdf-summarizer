"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useRef, useState } from "react";
import ErrorComp from "@/components/Error";
import Chat from "@/components/Chat";
import { AnimatePresence, motion } from "motion/react";



export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [fileObject, setFileObject] = useState<string | null>(null);
  const [fileString, setFileString] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  if (error) return <ErrorComp />;

  return (
    <>
      {fileObject && fileString && !loading && (
        <Chat file={fileObject} fileString={fileString} />
      )}

      <AnimatePresence>
        {!fileObject && (
          <motion.div
            className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
          >
            <Button
              className="bg-roody hover:bg-red-600 font-semibold shadow-xl w-24"
              onClick={() => {
                inputRef.current?.click();
              }}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Upload"}
            </Button>
            <p className="text-xs text-gray-400 font-semibold tracking-widest">
              max: 4mb
            </p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              ref={inputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                const maxSize = 4 * 1024 * 1024;

                if (file && file.size > maxSize) {
                  toast({
                    title: "Big PDF file",
                    description: "File size must be less than or equal to 4MB",
                  });

                  return;
                }

                // convert pdf to text

                if (file) {
                  setLoading(true);
                  const reader = new FileReader();

                  reader.onload = async () => {
                    const base64File = reader.result?.toString().split(",")[1];
                    if (!base64File) {
                      toast({
                        title: "Error",
                        description: "Failed to read file",
                      });
                      return;
                    }

                    try {
                      const response = await fetch("/api/text", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ file: base64File }),
                      });

                      const data = await response.json();
                      setFileString(data.text);
                    } catch (err) {
                      console.log(err);
                      setError(true);
                    } finally {
                      setLoading(false);
                      setFileObject(URL.createObjectURL(file));
                    }
                  };

                  reader.readAsDataURL(file);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
