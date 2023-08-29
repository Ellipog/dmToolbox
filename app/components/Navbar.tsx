import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDragon, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

type Props = {
  page: string;
};

const Navbar = (props: Props) => {
  return (
    <div className="fixed w-screen flex justify-center items-center row gap-5 bottom-4">
      <Link href="/battle">
        <div className="p-2 flex justify-center items-center text-[#f0eeee]">
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="w-10 h-10 hover:text-[#e4e0e0]"
          />
        </div>
      </Link>
      <Link href="/monsters">
        <div className="p-2 flex justify-center items-center text-[#f0eeee]">
          <FontAwesomeIcon
            icon={faDragon}
            className="w-10 h-10 hover:text-[#e4e0e0]"
          />
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
