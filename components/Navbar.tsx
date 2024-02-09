"use client"; 
import React from "react";
import { useState } from "react";
import Link from "next/link";


import { IoMdMenu, IoMdClose } from "react-icons/io";

interface NavItem {
  label: string;
  page: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    page: "home",
  },
  {
    label: "Room",
    page: "room",
  },
  {
    label: "Calendar",
    page: "calendar",
  },

];

export default function Navbar() {

  const [navbar, setNavbar] = useState(false);


  return (
    <header className="w-full mx-auto  px-4 sm:px-20 fixed top-0 z-50 shadow bg-stone-900 border-b">
      <div className="justify-between md:items-center md:flex">
        <div>
          <div className="flex items-center justify-between py-1 md:py-1 md:block">
            <Link href={"/home"}>
              <div className="container flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-neutral-100">Christopher Russell</h2>
              </div>
            </Link>
            
            <div className="md:hidden">
              <button
                className="p-2 text-white rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? <IoMdClose size={30} /> : <IoMdMenu size={30} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <div className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {NAV_ITEMS.map((item, idx) => {
                return (
                  
                    <Link
                    key={idx}
                    href={item.page}
                    className={
                      "block lg:inline-block text-neutral-100  hover:text-sky-600 "
                    }
      
                    onClick={() => setNavbar(!navbar)}
                  >
                    {item.label}
                  </Link>
                  
                  
                );
              })}
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
