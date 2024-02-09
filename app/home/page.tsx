"use client;";

import React from "react";
import Navbar from "@/components/Navbar";
import { FaCalendarPlus, FaPlus } from "react-icons/fa";
import CardAnnouncement from "@/components/CardAnnouncement";

export default function Home() {
  return (
    <>
      {/* <Navbar ></Navbar> */}
      <div className="flex flex-col items-center w-screen h-full md:bg-gray-1 pt-16 text-white">
        <div className="flex flex-row justify-center h-screen w-2/3 bg-gray-2 divide-x">
          
          
          {/* roomlist  */}
          <div className="w-1/5 h-screen  ">
            <div className="m-auto p-8 ">
              <div className="flex flex-row ">
                <h2 className="text-left grow ">Room List</h2>{" "}
                <FaPlus className="p-1 text-2xl hover:cursor-pointer"></FaPlus>
              </div>

              <div className="py-1 px-2 my-2 bg-slate-600 text-center rounded-lg shadow-lg border border-white">
                General
              </div>
              <div className="py-1 px-2 my-2 bg-slate-600 text-center rounded-lg shadow-lg border border-white">
                Room 1
              </div>
              <div className="py-1 px-2 my-2 bg-slate-600 text-center rounded-lg shadow-lg border border-white">
                Room 2
              </div>
            </div>
          </div>

          {/* main content */}
          <div className="w-3/5 h-screen  px-6">
            <div className="flex flex-row gap-4 items-center py-6">
              <div className="basis 1/5 p-1 bg-slate-600 flex flex-row items-center gap-2 border rounded-lg hover:cursor-pointer">
                Add News <FaCalendarPlus />
              </div>
              <form  className="basis-3/5 py-1 px-2 my-2 bg-slate-600 text-center rounded-full shadow-lg border border-white">
                search ...
              </form>
              <div className="basis-1/5 py-1 px-2 my-2 bg-slate-600 text-center rounded-lg shadow-lg border border-white">
                General
              </div>
            </div>

            <div className="flex flex-col items divide-y border-y">
                <CardAnnouncement></CardAnnouncement>
                <CardAnnouncement></CardAnnouncement>
            </div>
          </div>

          {/* calendar and upcoming */}
          <div className="w-1/5 h-screen   divide-y" >
            <div className="m-6 py-12 text-center bg-slate-600">Calendar</div>
            <div className="m-6 ">
              <h2 className="py-2 text-center text-xl ">Upcoming</h2>
              <div className="divide-y">
                <div className="flex flex-col px-2 py-1 bg-slate-600">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 bg-slate-600">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 bg-slate-600">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
