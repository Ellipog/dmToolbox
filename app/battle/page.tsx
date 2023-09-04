"use client";

import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

type Character = {
  id: number;
  name: string;
  health: number;
  initiative: number;
  emoji: string;
  statusEffects: any[];
};

export default function Home() {
  const [battleList, setBattleList] = useState<any[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🫥");
  const [name, setName] = useState("");
  const [health, setHealth] = useState("");
  const [initiative, setInitiative] = useState("");
  const [battleStatus, setBattleStatus] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [statusName, setStatusName] = useState("");
  const [amountOfTurns, setAmountOfTurns] = useState("");

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
      statusEffects: [], // Initialize an empty array for status effects
    };
    const savedCharacters: Character[] = JSON.parse(
      Cookies.get("characters") || "[]"
    );
    savedCharacters.push(data);
    const sortedBattleList = Object.values(savedCharacters).sort(
      (a, b) => b.initiative - a.initiative
    );
    Cookies.set("characters", JSON.stringify(sortedBattleList));
    setName("");
    setHealth("");
    setInitiative("");
    setSelectedEmoji("🫥");
    toast.success("Character added!");
    const savedBattleList = Cookies.get("characters");
    if (savedBattleList) {
      setBattleList(JSON.parse(savedBattleList));
      console.log(JSON.parse(savedBattleList ?? ""));
    } else {
      Cookies.set("characters", JSON.stringify(battleList));
    }
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
    } else {
      Cookies.set("characters", JSON.stringify(sortedBattleList));
    }
  }, []);

  useEffect(() => {
    Cookies.set("characters", JSON.stringify(sortedBattleList));
  }, [battleList]);

  let updatedBattleList: any = [];

  const sortedBattleList = Object.values(battleList).sort(
    (a, b) => b.initiative - a.initiative
  );

  useEffect(() => {
    setBattleList((prevBattleList) => {
      const updatedBattleList = prevBattleList.map((character) => {
        const updatedCharacter = { ...character };
        updatedCharacter.statusEffects = updatedCharacter.statusEffects.map(
          (statusEffect: any) => {
            const updatedStatusEffect = { ...statusEffect };
            updatedStatusEffect.remaining =
              updatedStatusEffect.added +
              updatedStatusEffect.turns -
              currentTurn;
            return updatedStatusEffect;
          }
        );
        updatedCharacter.statusEffects = updatedCharacter.statusEffects.filter(
          (statusEffect: { turns: number }) => statusEffect.turns !== 0
        );
        return updatedCharacter;
      });
      Cookies.set("characters", JSON.stringify(updatedBattleList));
      return updatedBattleList;
    });
  }, [currentCharacter]);

  const handleClick = (direction: string) => {
    setCurrentCharacter((prevCharacter: any) => {
      let nextCharacter;
      if (direction === "next") {
        nextCharacter = (prevCharacter + 1) % battleList.length;
        if (nextCharacter === 0) {
          setCurrentTurn((prevTurn) => prevTurn + 1);
        }
      } else if (direction === "previous") {
        if (currentTurn === 1 && prevCharacter === 0) {
          return prevCharacter; // Do not allow going back further
        }
        nextCharacter = prevCharacter - 1;
        if (nextCharacter < 0) {
          setCurrentTurn((prevTurn) => prevTurn - 1);
          nextCharacter = battleList.length - 1;
        }
      }
      return nextCharacter;
    });
  };

  const addStatusEffect = () => {
    const character = sortedBattleList[currentCharacter];
    if (!character.statusEffects) {
      character.statusEffects = []; // Initialize the statusEffects array if it doesn't exist
    }
    const newStatusEffect = {
      name: statusName,
      turns: parseInt(amountOfTurns),
      remaining: parseInt(amountOfTurns),
      added: currentTurn,
    };
    character.statusEffects.push(newStatusEffect);
    setStatusName("");
    setAmountOfTurns("");
    Cookies.set("characters", JSON.stringify(battleList));
  };

  return (
    <div className="bg-[#a08f82] text-black h-screen w-screen flex flex-col justify-center items-center gap-24">
      <Navbar page="home" />
      {!battleStatus && (
        <div className="flex flex-col justify-center items-center w-screen fixed top-[4vh]">
          <div className="flex row justify-center items-center gap-5 fixed top-[12vh] overflow-x-scroll overflow-y-hidden w-screen">
            {Object.values(battleList)
              .sort((a, b) => b.initiative - a.initiative)
              .map((char, i) => {
                const characterNumber = i + 1; // Declare and assign the character number
                char.characterNumber = characterNumber; // Add the character number to the char object
                updatedBattleList.push(char); // Push the updated char object to the updatedBattleList
                return (
                  <div
                    className="flex justify-center items-center flex-col"
                    key={i}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCharacter(char.id);
                      }}
                      className="text-l h-4 bg-[#cbc3bc] w-5/6 rounded-t-lg hover:bg-[#beb5ad] cursor-pointer text-[0.6rem] font-bold z-50 text-[#636261]"
                    >
                      DELETE
                    </button>
                    <div
                      className="flex flex-col justify-center items-center w-32 h-32 bg-[#d5cec7] rounded cursor-default shadow-l"
                      key={i}
                    >
                      <div className="flex justify-center items-center flex-col">
                        <p className="text-[80px]">{char.emoji}</p>
                        <p className="font-bold relative top-[-20px] text-[#636261]">
                          {char.name.length > 9
                            ? `${char.name.slice(0, 9)}..`
                            : char.name}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#e3ded9] w-24 h-6 rounded-lg justify-center items-center flex text-xl -mt-3 text-[#636261]">
                      {char.initiative}
                    </div>
                  </div>
                );
              })}
            <div className="flex flex-col justify-center items-center w-32 h-32 rounded cursor-default shadow-l">
              <div className="flex justify-center items-center flex-col">
                <button
                  className="font-light text-8xl text-[#636261] hover:text-[#383737] transition-all"
                  onClick={() => setOpenEditor(!openEditor)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            className="flex flex-col justify-center items-center w-1/12 h-12 bg-[#d5cec7] rounded shadow-l transition-all hover:bg-[#c8c1b9] cursor-pointer font-semibold text-xl text-[#636261]"
            onClick={() => {
              if (battleList[0]) {
                setBattleStatus(!battleStatus);
                setOpenEditor(false);
              } else {
                toast.error("You don't have any characters!");
              }
            }}
          >
            START
          </div>
        </div>
      )}
      {battleStatus && (
        <div className="flex flex-col justify-center items-center w-screen fixed top-[4vh]">
          <div className="flex row justify-center items-center gap-5 fixed top-[12vh] overflow-x-scroll overflow-y-hidden w-screen">
            {Object.values(battleList)
              .sort((a, b) => b.initiative - a.initiative)
              .map((char, i) => {
                const characterNumber = i;
                char.characterNumber = characterNumber;
                updatedBattleList.push(char);

                const isActiveCharacter = i === currentCharacter; // Check if it's the current turn character

                return (
                  <div
                    className={`flex justify-center items-center flex-col`}
                    key={i}
                  >
                    <div
                      className={`flex flex-col justify-center items-center w-32 h-32 bg-[#d5cec7] rounded cursor-default shadow-l ${
                        isActiveCharacter ? "bg-[#ece9e6]" : ""
                      } `}
                      key={i}
                    >
                      <div className="flex justify-center items-center flex-col">
                        <p className="text-[80px]">{char.emoji}</p>
                        <p className="font-bold relative top-[-20px] text-[#636261]">
                          {char.name.length > 9
                            ? `${char.name.slice(0, 9)}..`
                            : char.name}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#e3ded9] w-24 h-6 rounded-lg justify-center items-center flex text-xl -mt-3 text-[#636261]">
                      {char.initiative}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex flex-row justify-center items-center h-12 w-2/12">
            <button
              className="text-xl font-semibold text-[#636261] bg-[#d5cec7] rounded shadow-l px-4 py-2 mr-2 h-full transition-all hover:bg-[#c8c1b9]"
              onClick={() => handleClick("previous")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div
              className="flex flex-col justify-center items-center w-2/4 h-full bg-[#d5cec7] rounded shadow-l transition-all hover:bg-[#c8c1b9] cursor-pointer font-semibold text-xl text-[#636261]"
              onClick={() => {
                setBattleStatus(!battleStatus);
                setOpenEditor(false);
              }}
            >
              TURN {currentTurn}
              <p className="text-[7px] fixed top-[6.5vh]">CLICK TO STOP</p>
            </div>
            <button
              className="text-xl font-semibold text-[#636261] bg-[#d5cec7] rounded shadow-l px-4 py-2 ml-2 h-full transition-all hover:bg-[#c8c1b9]"
              onClick={() => handleClick("next")}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <div className="fixed left-50 top-[35vh] flex row gap-6 justify-center items-center w-2/4 h-[50vh] text-[#636261]">
            <div className="flex flex-col justify-top items-center w-1/4 h-full bg-[#d5cec7] rounded shadow-l">
              <p className="text-[9rem]">
                {sortedBattleList[currentCharacter].emoji}
              </p>
              <p className="text-2xl -mt-8">
                {sortedBattleList[currentCharacter].name.length > 12
                  ? `${sortedBattleList[currentCharacter].name.slice(0, 12)}..`
                  : sortedBattleList[currentCharacter].name}
              </p>
              <div className="flex justify-top items-start w-5/6 flex-col  overflow-scroll">
                <p className="text-[#800200] font-semibold mt-2">Health:</p>
                <p className="ml-2">
                  14/{sortedBattleList[currentCharacter].health}
                </p>
                <p className="text-[#800200] font-semibold mt-2">
                  Status Effects:
                </p>
                <div className="flex flex-col w-full gap-2 h-6">
                  <div className="flex row w-full gap-2 h-6">
                    <input
                      type="text"
                      className="h-full py-1 rounded px-2 bg-[#f3f2f0] mt-2 w-3/5"
                      placeholder="Name"
                      value={statusName}
                      onChange={(event) => setStatusName(event.target.value)}
                    />
                    <input
                      type="number"
                      className="h-full py-1 rounded px-2 bg-[#f3f2f0] mt-2 w-3/5"
                      placeholder="Turns"
                      value={amountOfTurns}
                      onChange={(event) => setAmountOfTurns(event.target.value)}
                    />
                    <button
                      className="bg-[#f3f2f0] rounded px-2 mt-2 h-6 flex justify-center items-center hover:bg-[#e1e0dd] transition-all"
                      onClick={addStatusEffect}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-4 h-full w-full flex gap-1 flex-col">
                  {sortedBattleList[currentCharacter].statusEffects &&
                    sortedBattleList[currentCharacter].statusEffects.map(
                      (effect: any, i: number) =>
                        effect.remaining > 0 && (
                          <div
                            className="flex justify-between w-full rounded px-2 bg-[#f3f2f0]"
                            key={i}
                          >
                            <p>
                              {effect.name.length > 11
                                ? `${effect.name.slice(0, 11)}..`
                                : effect.name}
                            </p>
                            <p>Turns: {effect.remaining}</p>
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-3/4 h-full bg-[#d5cec7] rounded shadow-l"></div>
          </div>
        </div>
      )}
      {openEditor && (
        <div className="bg-[#9a5c2c] w-1/3 text-black h-1/5 flex justify-center items-center row gap-24 fixed top-50 left-50">
          <div className="h-full w-full bg-[#e3ded9] rounded flex row justify-center items-center px-8">
            <div className="flex gap-4 row w-full h-28">
              <button
                className="font-light text-6xl text-[#f3f2f0] hover:text-[#a09e9a] transition-all fixed top-[39vh] left-[64.5vw] rotate-45"
                onClick={() => setOpenEditor(!openEditor)}
              >
                +
              </button>
              <div className="flex w-3/12 h-full justify-center items-center">
                <div
                  className="w-28 h-28 text-[80px] flex justify-center items-center bg-[#f3f2f0] rounded cursor-pointer"
                  onClick={() => {
                    setIsPickerOpen(true);
                  }}
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
      )}
      <div className="fixed">
        {isPickerOpen && (
          <div onClick={(event) => event.stopPropagation()}>
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
