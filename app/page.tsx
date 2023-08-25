"use client";

import React, { useState, useEffect } from "react";

interface Sense {
  passive_perception: number;
  blindsight: string;
  darkvision: string;
}

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
  walkspeed: string;
  burrowspeed: string;
  climbspeed: string;
  flyspeed: string;
  swimspeed: string;
  armor_class: number;
  hit_points_roll: string;
  strength_save: number;
  dexterity_save: number;
  constitution_save: number;
  intelligence_save: number;
  wisdom_save: number;
  charisma_save: number;
  index: string;
  proficiencies: Array<any>;
  languages: string;
  senses: Sense;
  xp: number;
}

export default function Home() {
  const [monster, setMonster] = useState<Monster | null>(null);

  const fetchMonsterData = () => {
    fetch("https://www.dnd5eapi.co/api/monsters")
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const monsterData = data.results[randomIndex].index;
        fetch(`https://www.dnd5eapi.co/api/monsters/${monsterData}`) // changed the API to open5e
          .then((response) => response.json())
          .then((data) => {
            const monsterData = data;
            monsterData.armor_class = data.armor_class[0].value;
            monsterData.walkspeed = data.speed.walk;
            monsterData.burrowspeed = data.speed.burrow;
            monsterData.climbspeed = data.speed.climb;
            monsterData.flyspeed = data.speed.fly;
            monsterData.swimspeed = data.speed.swim;
            setMonster(monsterData);
            console.log(monsterData);
          });
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
    <div className="bg-[#a08f82] rounded px-8 pt-6 pb-8 text-black h-screen flex justify-center items-center shadow-2xl">
      <div className="h-5/6 w-1/3 bg-[#e3ded9] p-8 rounded">
        <section>
          <h1 className="text-4xl mb-2 text-[#800200]">{monster.name}</h1>
          <div className="flex row gap-1">
            {monster.size} {monster.type},
            <p className="font-thin">{monster.alignment}</p>
          </div>
        </section>
        <hr className="border-[#800200] mb-5 mt-5" />
        <div className="flex row gap-2">
          <p className="font-bold">Armor Class:</p>
          <div className="flex row gap-2">
            <p className="text-base mb-2">{monster.armor_class}</p>
          </div>
        </div>
        <div className="flex row gap-2">
          <p className="font-bold">Hit Points:</p>
          <div className="flex row gap-2">
            <div className="text-base mb-2 flex row gap-1">
              {monster.hit_points}{" "}
              <p className="font-extralight">({monster.hit_points_roll})</p>
            </div>
          </div>
        </div>
        <div className="flex row gap-2">
          <p className="font-bold">Speed:</p>
          <div className="flex row gap-2">
            {monster.walkspeed !== undefined && (
              <p className="text-base mb-2">Walk {monster.walkspeed}</p>
            )}
            {monster.burrowspeed !== undefined && (
              <p className="text-base mb-2">Burrow {monster.burrowspeed}</p>
            )}
            {monster.climbspeed !== undefined && (
              <p className="speed-climb">Climb {monster.climbspeed}</p>
            )}
            {monster.flyspeed !== undefined && (
              <p className="speed-fly">Fly {monster.flyspeed}</p>
            )}
            {monster.swimspeed !== undefined && (
              <p className="speed-swim">Swim {monster.swimspeed}</p>
            )}
          </div>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
        <div className="mb-4 flex row w-full justify-between">
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.strength}
            </p>
            <p className="text-base">STR</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.dexterity}
            </p>
            <p className="text-base">DEX</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.constitution}
            </p>
            <p className="text-base">CON</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.intelligence}
            </p>
            <p className="text-base">INT</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.wisdom}
            </p>
            <p className="text-base">WIS</p>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="bg-[#d5cec7] rounded-full p-2 h-12 w-12 justify-center items-center flex">
              {monster.charisma}
            </p>
            <p className="text-base">CHA</p>
          </div>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
        {monster.proficiencies[0] !== undefined &&
          Object.values(monster.proficiencies).map((monster, i) => {
            return (
              <div className="flex row gap-3 mt-2" key={i}>
                <p className="font-bold">{monster.proficiency.name}:</p>
                <p className="text-base">{monster.value}</p>
              </div>
            );
          })}
        {monster.proficiencies[0] == undefined && (
          <div className="flex row gap-3">
            <p className="font-bold">No proficiencies</p>
          </div>
        )}
        <hr className="border-[#800200] mb-5 mt-5" />
        <div className="flex row gap-2 mt-2">
          <p className="font-bold">Languages:</p>
          {monster.languages !== undefined && (
            <p className="text-base">{monster.languages}</p>
          )}
          {monster.languages == "" && <p className="text-base">None</p>}
        </div>
        <div className="flex row gap-2 mt-2">
          <p className="font-bold">Passive Perception:</p>
          {monster.senses.passive_perception !== undefined && (
            <p className="text-base">{monster.senses.passive_perception}</p>
          )}
          {monster.senses.passive_perception == undefined && (
            <p className="text-base">0</p>
          )}
        </div>
        <div className="flex row gap-2 mt-2">
          <p className="font-bold">Senses:</p>
          {monster.senses.darkvision !== undefined && (
            <p className="text-base">Darkvision {monster.senses.darkvision}</p>
          )}
          {monster.senses.blindsight !== undefined && (
            <p className="text-base">Blindsight {monster.senses.blindsight}</p>
          )}
          {monster.senses.darkvision == undefined && (
            <p className="text-base">Darkvision 0 ft.</p>
          )}
          {monster.senses.blindsight == undefined && (
            <p className="text-base">Blindsight 0 ft.</p>
          )}
        </div>
        <div className="flex row gap-2 mt-2">
          <p className="font-bold">XP:</p>
          <p className="text-base">{monster.xp}</p>
        </div>
        <hr className="border-[#800200] mb-5 mt-5" />
      </div>
    </div>
  );
}
