"use client";

import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

  const handleEmojiInputChange = (event: any) => {
    setSelectedEmoji(event.target.textContent);
  };

  return (
    <div className="bg-[#a08f82] px-8 pt-6 pb-8 text-black h-screen w-screen flex flex-row justify-center items-center gap-24">
      <Navbar page="home" />
      <div className="bg-[#a08f82] w-1/3 text-black h-1/5 flex justify-center items-center row gap-24">
        <div className="h-full w-full bg-[#e3ded9] p-10 rounded flex row">
          <div className="flex gap-4 row w-full h-28">
            <div
              className="w-28 h-28 text-[80px] flex justify-center items-center bg-white rounded"
              placeholder="😁"
              onClick={() => {
                setIsPickerOpen(true);
              }}
              style={{ outline: "none" }}
              onInput={handleEmojiInputChange}
            >
              {selectedEmoji}
            </div>
            <div className="flex flex-col gap-4 w-4/6 h-full">
              <input
                type="text"
                className="h-full p-1 rounded px-3"
                placeholder="Name"
              />
              <div className="flex row gap-5 w-full h-full">
                <input
                  type="number"
                  className="h-full w-1/2 p-2 rounded px-3"
                  placeholder="Health"
                  onKeyDown={(event) => {
                    const keyCode = event.key;
                    const isValidKey = !!(keyCode >= "0" && keyCode <= "9"); // Check if the key is a number (0-9)
                    if (!isValidKey) {
                      event.preventDefault(); // Prevent the default behavior of the event
                    }
                  }}
                />
                <input
                  type="number"
                  className="h-full w-1/2 p-2 rounded px-3"
                  placeholder="Initiative"
                  onKeyDown={(event) => {
                    const keyCode = event.key;
                    const isValidKey = !!(keyCode >= "0" && keyCode <= "9"); // Check if the key is a number (0-9)
                    if (!isValidKey) {
                      event.preventDefault(); // Prevent the default behavior of the event
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="h-full flex justify-center items-center">
            <button className="h-14 w-14 bg-[#f3f2f0] rounded transition-all hover:bg-[#eeede9]">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed">
        {isPickerOpen && (
          <div ref={pickerRef} onClick={(event) => event.stopPropagation()}>
            <Picker
              data={data}
              className="fixed top-5"
              onEmojiSelect={(emoji: any) => {
                const selectedEmoji = emoji.native;
                setSelectedEmoji(selectedEmoji);
                setIsPickerOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
