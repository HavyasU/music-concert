import React from "react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="bg-black">
      <div className="bg-black z-0   opacity-20">
        <video
          className="w-screen  absolute  bg-attachement"
          autoPlay
          muted
          loop
          src="src\assets\videos\bg.mp4"
        ></video>
      </div>
      <div className="h-screen bg-transparent relative playfair-display-font">
        <div className="px-20">
          <h2 className="text-9xl mb-2 pt-40 text-gray-200  playfair-display-font font-extrabold">
            Concertz
          </h2>
          <h3 className="text-2xl pl-5  tracking-wider    roboto-condensed-font font-bold text-zinc-400">
            Find Your Next Concert Here
          </h3>

          <div className="px-5 my-5  cursor-pointer">
            <Button className="p-4  hover:bg-gray-500 py-6 font-extrabold text-xl">
              Explore Concerts
            </Button>
          </div>
        </div>
        <div className="text-white w-full text-center flex justify-center items-center text-6xl">
          <h4 className="text-5xl uppercase  absolute bottom-10 playfair-display-font font-extrabold">
            “Turn the volume up. The night is about to go live.”
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Hero;
