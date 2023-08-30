"use client";

import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function Home() {
  const [battleList, setBattleList] = useState<any[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("🫥");
  const [name, setName] = useState("");
  const [health, setHealth] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleEmojiInputChange = (event: any) => {
    setSelectedEmoji(event.target.textContent);
  };

  const saveCharacter = () => {
    if (!name || !health || !initiative || !selectedEmoji) {
      toast.error("Please fill in all the fields");
      return;
    }
    const id = Math.floor(Math.random() * 900000000) + 100000000;
    const data = {
      id,
      name,
      health: parseInt(health),
      initiative: parseInt(initiative),
      emoji: selectedEmoji,
    };
    const savedCharacters = JSON.parse(Cookies.get("characters") || "[]");
    console.log(savedCharacters);
    savedCharacters.push(data);
    Cookies.set("characters", JSON.stringify(savedCharacters));
    setName("");
    setHealth("");
    setInitiative("");
    setSelectedEmoji("🫥");
    toast.success("Character added!");
  };

  const removeCharacter = (id: number) => {
    const savedCharacters = JSON.parse(Cookies.get("characters") || "[]");
    const updatedCharacters = savedCharacters.filter(
      (character: any) => character.id !== id
    );
    Cookies.set("characters", JSON.stringify(updatedCharacters));
    setBattleList(updatedCharacters);
    toast.success("Character removed!");
  };

  useEffect(() => {
    const savedBattleList = Cookies.get("characters");
    if (savedBattleList) {
      setBattleList(JSON.parse(savedBattleList));
      console.log(JSON.parse(savedBattleList ?? ""));
    }
  }, [Cookies.get("characters")]);

  return (
    <div className="bg-[#a08f82] text-black h-screen w-screen flex flex-col justify-center items-center gap-24">
      <Navbar page="home" />
      <div className="flex row justify-center items-center gap-5 fixed top-[12vh]">
        {Object.values(battleList)
          .sort((a, b) => b.initiative - a.initiative)
          .map((char, i) => {
            return (
              <div className="flex justify-center items-center flex-col">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCharacter(char.id);
                  }}
                  className="text-l h-4 bg-[#cbc3bc] w-5/6 rounded-t-lg hover:bg-[#beb5ad] cursor-pointer text-[0.6rem] font-bold mb-[-8px]"
                >
                  DELETE
                </button>
                <div
                  className="flex flex-col mt-2 justify-center items-center w-32 h-32 bg-[#d5cec7] px-2 py-1 rounded cursor-default shadow-l"
                  key={i}
                >
                  <div className="flex justify-center items-center flex-col">
                    <p className="text-[80px]">{char.emoji}</p>
                    <p className="font-bold relative top-[-20px]">
                      {char.name.length > 9
                        ? `${char.name.slice(0, 9)}..`
                        : char.name}
                    </p>
                  </div>
                </div>
                <div className="bg-[#e3ded9] w-24 h-6 rounded-lg justify-center items-center flex text-xl fixed top-[25vh]">
                  {char.initiative}
                </div>
              </div>
            );
          })}
      </div>
      <div className="bg-[#a08f82] w-1/3 text-black h-1/5 flex justify-center items-center row gap-24">
        <div className="h-full w-full bg-[#e3ded9] rounded flex row justify-center items-center px-8">
          <div className="flex gap-4 row w-full h-28">
            <div className="flex w-3/12 h-full justify-center items-center">
              <div
                className="w-28 h-28 text-[80px] flex justify-center items-center bg-[#f3f2f0] rounded cursor-pointer"
                placeholder="😁"
                onClick={() => {
                  setIsPickerOpen(true);
                }}
                style={{ outline: "none" }}
                onInput={handleEmojiInputChange}
              >
                {selectedEmoji}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-4/6 h-full">
              <input
                type="text"
                className="h-full p-1 rounded px-3 bg-[#f3f2f0]"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <div className="flex row gap-5 w-full h-full">
                <input
                  type="number"
                  className="h-full w-1/2 p-2 rounded px-3 bg-[#f3f2f0]"
                  placeholder="Health"
                  value={health}
                  onChange={(event) => setHealth(event.target.value)}
                  onKeyDown={(event) => {
                    const keyCode = event.key;
                    const isValidKey =
                      !!(keyCode >= "0" && keyCode <= "9") ||
                      keyCode === "Backspace"; // Check if the key is a number (0-9) or Backspace
                    if (!isValidKey) {
                      event.preventDefault(); // Prevent the default behavior of the event
                    }
                  }}
                />
                <input
                  type="number"
                  className="h-full w-1/2 p-2 rounded px-3 bg-[#f3f2f0]"
                  placeholder="Initiative"
                  value={initiative}
                  onChange={(event) => setInitiative(event.target.value)}
                  onKeyDown={(event) => {
                    const keyCode = event.key;
                    const isValidKey =
                      !!(keyCode >= "0" && keyCode <= "9") ||
                      keyCode === "Backspace"; // Check if the key is a number (0-9) or Backspace
                    if (!isValidKey) {
                      event.preventDefault(); // Prevent the default behavior of the event
                    }
                  }}
                />
              </div>
            </div>
            <div className="h-full w-1/6 flex justify-center items-center">
              <button
                className="h-14 w-14 bg-[#f3f2f0] rounded transition-all hover:bg-[#eeede9]"
                onClick={saveCharacter}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
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
