import Image from "next/image";
import React from "react";
import errorImage from "../../public/error.svg";

function ErrorComp() {
  return (
    <div className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center">
      <Image src={errorImage} alt="" className="w-20 h-20 text-roody mb-3" />
      <p className="font-semibold">Oops something went wrong</p>
      <p className="font-thin text-slate-400">try refreshing the page</p>
    </div>
  );
}

export default ErrorComp;
