"use client";

import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function Home() {
  const [battleList, setBattleList] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  useEffect(() => {
    const savedBattleList = Cookies.get("battleList");
    if (savedBattleList) {
      setBattleList(JSON.parse(savedBattleList));
    }
  }, []);

  useEffect(() => {
    Cookies.set("battleList", JSON.stringify(battleList));
  }, [battleList]);

  const addEmojiCloserListener = () => {
    document.addEventListener("click", handleClickOutside);
  };

  const removeEmojiCloserListener = () => {
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const emojiPicker = document.querySelector("#emoji-picker");
    const emojiInput = document.querySelector("#emoji-input");

    if (emojiPicker && emojiInput) {
      if (isPickerOpen) {
        setIsPickerOpen(false);
        removeEmojiCloserListener();
      }
    }
  };

  return (
    <div className="bg-[#a08f82] px-8 pt-6 pb-8 text-black h-screen w-screen flex flex-row justify-center items-center gap-24">
      <Navbar page="home" />
      <div className="bg-[#a08f82] w-1/3 pb-7 pt-7 text-black h-screen flex justify-center items-center row gap-24">
        <div className="h-5/6 w-full bg-[#e3ded9] p-8 rounded flex gap-4 flex-col">
          <input type="text" className="w-24 h-24" placeholder="Name" />
          <input
            type="text"
            className="w-24 h-24"
            id="emoji-input"
            placeholder="😁"
            value={selectedEmoji}
            onChange={() => {}}
            onClick={() => {
              setIsPickerOpen(true);
              addEmojiCloserListener();
            }}
          />
          {isPickerOpen && (
            <div ref={pickerRef} onClick={(event) => event.stopPropagation()}>
              <Picker
                data={data}
                id="emoji-picker"
                onEmojiSelect={(emoji: any) => {
                  const selectedEmoji = emoji.native;
                  setSelectedEmoji(selectedEmoji);
                  setIsPickerOpen(false);
                  removeEmojiCloserListener();
                }}
              />
            </div>
          )}
          <input type="number" className="w-24 h-24" placeholder="Health" />
          <input type="number" className="w-24 h-24" placeholder="Initiative" />
        </div>
      </div>
    </div>
  );
}
