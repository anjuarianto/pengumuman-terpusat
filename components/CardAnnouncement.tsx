"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";

export default function CardAnnouncement({receiver,title,date,time,content}:{
  receiver: { value: string; label: string; };
  title: string;
  date: string;
  time: string;
  content: string;
}) {
  return (
    <>
      <div className="p-2 bg-white rounded-lg hover:cursor-default">
        <div className="flex flex-col gap-2 p-2 rounded-lg ">
          <div className="flex flex-row items-center gap-2 text-sm ">
            <span>• {receiver.label}</span>{" "}
            <span className="text-main-3">{date}{" "}{time} </span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="py-2 ">
            {content}
          </p>
          <div className="flex flex-row gap-4 text-sm">
            <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg ">
              <FaCommentAlt /> Reply
            </button>
            <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg ">
              <FaEdit /> Edit
            </button>
            <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg ">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
