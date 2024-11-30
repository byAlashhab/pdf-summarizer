"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ABeeZee } from "next/font/google";
import { useRef, useState } from "react";

const font = ABeeZee({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>();

  return (
    <>
      <div className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center">
        <Button
          className="bg-roody hover:bg-red-700 font-semibold shadow-lg"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Upload
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
  
                  console.log(data.text);

                } catch (err) {
                  console.log(err);
                  toast({
                    title: "Error",
                    description: "Oops there was an error processing the file",
                  });
                }

                
              };

              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
    </>
  );
}
