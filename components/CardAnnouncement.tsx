"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";

export default function CardAnnouncement() {
  return (
    <>
      <div className="py-1">
        <div className="flex flex-col gap-2 p-2 rounded-lg hover:bg-gray-1">
          <div className="flex flex-row items-center gap-2 text-sm ">
            <span>• Pak John</span> <span className="text-gray-300">15 January 2024 09:12:55</span>
          </div>
          <h1 className="font-bold text-2xl">Judul Pengumuman</h1>
          <p className="py-2 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <div className="flex flex-row gap-4 text-sm">
            <button className="px-4 py-1 border flex flex-row items-center gap-2 rounded-lg hover:cursor-pointer">
              <FaCommentAlt /> Reply
            </button>
            <button className="px-4 py-1 border flex flex-row items-center gap-2 rounded-lg hover:cursor-pointer">
              <FaEdit /> Edit
            </button>
            <button className="px-4 py-1 border flex flex-row items-center gap-2 rounded-lg hover:cursor-pointer">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
