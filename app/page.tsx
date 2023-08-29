"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

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
  actions: Array<any>;
  id: number;
}

export default function Home() {
  const [monster, setMonster] = useState<Monster | null>(null);
  const [notes, setNotes] = useState("");
  const [found, setFound] = useState(true);
  const [savedMonsterCookies, setSavedMonsterCookies] = useState<Array<any>>(
    []
  );

  const fetchRandomMonster = () => {
    fetch("https://www.dnd5eapi.co/api/monsters")
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        fetchMonsterData(data.results[randomIndex].index);
      })
      .catch((error) => {
        console.error("Error fetching monster list:", error);
        setFound(false);
      });
  };

  const fetchMonsterData = (monsterData: any) => {
    monsterData = monsterData
      .replace(/\s/g, "-")
      .toLowerCase()
      .replace(/,/g, "") // make it also replace capital with lowercase and remove " form" and commas
      .replace("-form", "");

    fetch(`https://www.dnd5eapi.co/api/monsters/${monsterData}`) // changed the API to open5e
      .then((response) => response.json())
      .then((data) => {
        if (data.actions[0].name == undefined) {
          fetchRandomMonster();
        } else if (data.armor_class[0].value) {
          setFound(true);
          const monsterData = data;
          monsterData.armor_class = data.armor_class[0].value;
          monsterData.walkspeed = data.speed.walk;
          monsterData.burrowspeed = data.speed.burrow;
          monsterData.climbspeed = data.speed.climb;
          monsterData.flyspeed = data.speed.fly;
          monsterData.swimspeed = data.speed.swim;
          setMonster(monsterData);
          console.log(monsterData.index);
        } else {
          setFound(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching monster data:", error);
        setFound(false);
      });
  };

  const saveMonster = () => {
    if (monster) {
      monster.id = Math.floor(Math.random() * 900000000) + 100000000;
      const savedMonsters = JSON.parse(Cookies.get("savedMonsters") || "[]");

      if (monster) {
        const monsterWithId = {
          id: monster.id,
          name: monster.name,
          index: monster.index,
        };
        savedMonsters.push(monsterWithId);
        Cookies.set("savedMonsters", JSON.stringify(savedMonsters));
        setSavedMonsterCookies(savedMonsters); // Update savedMonsterCookies
      }
    }
  };

  const clearMonster = (id: any) => {
    const savedMonsters = JSON.parse(Cookies.get("savedMonsters") || "[]");

    if (monster) {
      const updatedMonsters = savedMonsters.filter(
        (savedMonster: any) => savedMonster.id !== id
      );

      Cookies.set("savedMonsters", JSON.stringify(updatedMonsters));
      setSavedMonsterCookies(updatedMonsters); // Update savedMonsterCookies
    }
  };

  useEffect(() => {
    const savedNotes = Cookies.get("notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
    fetchRandomMonster();
  }, []);

  useEffect(() => {
    Cookies.set("notes", notes);
  }, [notes]);

  useEffect(() => {
    setSavedMonsterCookies(JSON.parse(Cookies.get("savedMonsters") || "[]"));
  }, [monster]);

  if (!monster) {
    return (
      <div className="bg-[#a08f82] shadow-md rounded text-black h-screen flex justify-center items-center">
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
    <div className="bg-[#a08f82] px-8 pt-6 pb-8 text-black h-screen flex justify-center items-center shadow-2xl row gap-24">
      <div className="w-1/5 h-5/6 flex flex-col gap-10">
        <div className="h-3/5">
          <textarea
            className="w-full h-full bg-[#e3ded9] rounded p-4"
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: "none" }}
          />
        </div>
        <div className="h-2/5" style={{ maxHeight: "35%" }}>
          <div className="w-full h-full bg-[#e3ded9] rounded p-4 flex flex-col gap-2">
            <div className="flex gap-3">
              <input
                className="w-full rounded bg-[#f3f2f0] p-1"
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const inputElement = e.target as HTMLInputElement;
                    fetchMonsterData(inputElement.value);
                    inputElement.value = ""; // Clear the search field
                  }
                }}
              />
              <button
                className="w-3/6 rounded bg-[#f3f2f0] p-1 ransition-all hover:bg-[#eeede9]"
                onClick={() => fetchRandomMonster()}
              >
                Random
              </button>
            </div>
            <div className="overflow-scroll h-[95%] w-full">
              {Object.values(savedMonsterCookies).map((monster, i) => {
                return (
                  <div
                    className="flex row gap-3 mt-2 justify-between w-full bg-[#d5cec7] px-2 py-1 rounded cursor-pointer transition-all hover:bg-[#ccc4bb]"
                    key={i}
                    onClick={() => fetchMonsterData(monster.index)}
                  >
                    <p className="font-medium">{monster.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearMonster(monster.id);
                      }}
                      className="text-l h-full w-1/12"
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="hover:animate-pulse"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {!found && (
        <div className="bg-[#a08f82] w-1/3 pb-7 pt-7 text-black h-screen flex justify-center items-center row gap-24">
          <div className="h-5/6 w-full bg-[#e3ded9] p-8 rounded overflow-scroll">
            <section>
              <h1 className="text-4xl mb-4 text-[#800200]">
                Monster not found!
              </h1>
              <div className="flex flex-col gap-1">
                Search for a new monster!
              </div>
            </section>
          </div>
        </div>
      )}
      {found && monster && (
        <div className="h-5/6 w-1/3 bg-[#e3ded9] p-8 rounded overflow-scroll">
          <section>
            <h1 className="text-4xl mb-2 text-[#800200]">{monster.name}</h1>

            <div className="flex row gap-1">
              <button onClick={() => saveMonster()}>
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  className="hover:text-[#800200] transition-all800200 text-xl mr-1"
                />
              </button>
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
              <p className="text-base">
                Darkvision {monster.senses.darkvision}
              </p>
            )}
            {monster.senses.blindsight !== undefined && (
              <p className="text-base">
                Blindsight {monster.senses.blindsight}
              </p>
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
        </div>
      )}

      <div className="flex flex-col w-1/4 h-5/6 gap-5 overflow-scroll bg-[#e3ded9] rounded p-5 shadow">
        {monster.actions[0].name == "Multiattack" && (
          <div className="w-full bg-[#d6cfc9] p-8 rounded">
            <section>
              <h1 className="text-2xl mb-2 text-[#432524]">
                {monster.actions[0].name}
              </h1>
              <div className="flex row gap-1 font-light">
                {monster.actions[0].desc}
              </div>
            </section>
            <hr className="border-[#800200] mb-5 mt-5" />
            {monster.actions[0].actions[0] !== undefined &&
              Object.values(monster.actions[0].actions).map(
                (actions: any, i) => {
                  return (
                    <div className="flex row gap-2" key={i}>
                      <p className="font-bold">{actions.action_name}:</p>
                      <div className="flex row gap-2">
                        <div className="text-base mb-2 flex row gap-1">
                          {actions.count}
                          <p className="font-extralight">({actions.type})</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        )}
        {monster.actions[0].name !== "" &&
          Object.values(monster.actions)
            .filter(
              (action, index) => index > 0 || action.name !== "Multiattack"
            )
            .map((actions, i) => {
              return (
                <div className="w-full bg-[#d6cfc9] p-8 rounded shadow" key={i}>
                  <section>
                    <h1 className="text-2xl mb-2 text-[#432524]">
                      {actions.name}
                    </h1>
                    <div className="flex row gap-1 font-light">
                      {actions.desc}
                    </div>
                  </section>
                  <hr className="border-[#800200] mb-5 mt-5" />
                  {actions.damage &&
                    actions.damage.length > 0 &&
                    actions.damage[0].damage_type && (
                      <div className="flex row gap-2">
                        <p className="font-bold">
                          {actions.damage[0].damage_type.name}:
                        </p>
                        <p className="text-base mb-2">
                          {actions.damage[0].damage_dice}
                        </p>
                      </div>
                    )}
                  {actions.damage &&
                    actions.damage.length > 0 &&
                    actions.damage[1] && (
                      <div className="flex row gap-2">
                        <p className="font-bold">
                          {actions.damage[1].damage_type.name}:
                        </p>
                        <p className="text-base mb-2">
                          {actions.damage[1].damage_dice}
                        </p>
                      </div>
                    )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
