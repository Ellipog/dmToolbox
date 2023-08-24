"use client";

import React, { useState, useEffect } from "react";

interface Monster {
  name: string;
  size: string;
  type: string;
  alignment: string;
  hit_points: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  walkspeed: number;
  burrowspeed: number;
  climbspeed: number;
  flyspeed: number;
  swimspeed: number;
  armor_class: number;
  hit_dice: string;
}

export default function Home() {
  const [monster, setMonster] = useState<Monster | null>(null);

  const fetchMonsterData = () => {
    fetch("https://api.open5e.com/monsters/") // changed the API to open5e
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const monsterData = data.results[randomIndex];
        console.log(monsterData);
        if (monsterData.hit_points > 100) {
          fetchMonsterData();
          return;
        }
        setMonster(monsterData);
        monsterData.walkspeed = data.results[randomIndex].speed.walk;
        monsterData.burrowspeed = data.results[randomIndex].speed.burrow;
        monsterData.climbspeed = data.results[randomIndex].speed.climb;
        monsterData.flyspeed = data.results[randomIndex].speed.fly;
        monsterData.swimspeed = data.results[randomIndex].speed.swim;
      });
  };

  useEffect(() => {
    fetchMonsterData();
  }, []);

  if (!monster) {
    return (
      <div className="bg-[#a08f82] shadow-md rounded px-8 pt-6 pb-8 text-black h-screen flex justify-center items-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#a08f82] shadow-md rounded px-8 pt-6 pb-8 text-black h-screen flex justify-center items-center">
      <div className="h-5/6 w-1/3 bg-[#e3ded9] p-8 rounded">
        <section>
          <h1 className="text-4xl mb-2 text-[#800200]">{monster.name}</h1>
          <div className="flex row gap-1">
            {monster.size} {monster.type},
            <p className="font-thin">{monster.alignment}</p>
          </div>
        </section>
        <hr className="border-[#800200] mb-5 mt-5" />
        <div className="flex row gap-3">
          <p className="font-bold">Armor Class:</p>
          <div className="flex row gap-2">
            <p className="text-base mb-2">{monster.armor_class}</p>
          </div>
        </div>
        <div className="flex row gap-3">
          <p className="font-bold">Hit Points:</p>
          <div className="flex row gap-2">
            <div className="text-base mb-2 flex row gap-1">
              {monster.hit_points}{" "}
              <p className="font-extralight">({monster.hit_dice})</p>
            </div>
          </div>
        </div>
        <div className="flex row gap-3">
          <p className="font-bold">Speed:</p>
          <div className="flex row gap-2">
            {monster.walkspeed !== undefined && (
              <p className="text-base mb-2">Walk {monster.walkspeed}ft.</p>
            )}
            {monster.burrowspeed !== undefined && (
              <p className="text-base mb-2">Burrow {monster.burrowspeed}ft.</p>
            )}
            {monster.climbspeed !== undefined && (
              <p className="speed-climb">Climb {monster.climbspeed}ft.</p>
            )}
            {monster.flyspeed !== undefined && (
              <p className="speed-fly">Fly {monster.flyspeed}ft.</p>
            )}
            {monster.swimspeed !== undefined && (
              <p className="speed-swim">Swim {monster.swimspeed}ft.</p>
            )}
          </div>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
        <div className="mb-4 flex row w-full justify-between">
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.strength}
            </p>
            <p className="text-base mb-2">STR</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.dexterity}
            </p>
            <p className="text-base mb-2">DEX</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.constitution}
            </p>
            <p className="text-base mb-2">CON</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.intelligence}
            </p>
            <p className="text-base mb-2">INT</p>
          </div>
          <div>
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.wisdom}
            </p>
            <p className="text-base mb-2">WIS</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.charisma}
            </p>
            <p className="text-base mb-2">CHA</p>
          </div>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
        <div>
          <p>WHWHW</p>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
      </div>
    </div>
  );
}
