import Image from "next/image";
import React from "react";

const LoginLeft = () => {
  return (
    <div className="flex-1 relative hidden lg:flex  flex-col w-full h-[600px]  max-w-[99%]  justify-between items-center gap-5 overflow-hidden  p-5 rounded-md  ">
      <div className="font-serif flex flex-col gap-2">
        <p className="  text-5xl ">“Knowledge is the key to success”</p>
        <p className="text-end text-xl">Anonimus</p>
      </div>
      <div className="relative md:w-[400px] lg:w-[500px]  h-[300px]">
        <Image className="rounded-md" fill src="/login.jpg" alt="Login-image" />
      </div>
      <div className=" flex gap-5 ">
        <div className="  text-xl">Open: 10:00 AM</div>
        <div className="  text-xl ">Close:5:00 PM</div>
      </div>
    </div>
  );
};

export default LoginLeft;
