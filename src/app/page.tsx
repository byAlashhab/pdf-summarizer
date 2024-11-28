"use client";

import { Button } from "@/components/ui/button";
import { ABeeZee } from "next/font/google";
import { useRef, useState } from "react";

const font = ABeeZee({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>();

  return (
    <>
      <div className="absolute inset-0 m-auto w-fit h-fit">
        <Button
          className="bg-roody hover:bg-red-700 font-semibold h-12 w-24 shadow-lg"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Upload
        </Button>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={inputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </>
  );
}
