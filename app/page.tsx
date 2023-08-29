"use client";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="bg-[#a08f82] text-black h-screen flex flex-col">
      <Navbar page="home" />
      <div className="w-screen h-screen justify-center items-center flex flex-col">
        <h2 className="text-[#e3ded9]">WELCOME TO THE</h2>
        <h1 className="text-[#e3ded9] text-6xl">DUNGEON MASTERS'S TOOBLOX!</h1>
        <p className="text-[#e3ded9] mt-24">
          Click one of the icons on the hotbar below!
        </p>
      </div>
    </div>
  );
}
