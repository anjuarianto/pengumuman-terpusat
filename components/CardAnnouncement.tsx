"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";

type EditPengumuman = {
  id: number;
  room: { id: number; name: string };
  title: string;W
  date: string;
  time: string;
  created_by: string;
  room_id: number;
  content: string;
  editForm: (id: number) => void;
  can_reply: boolean;
  can_edit: boolean;
  can_delete: boolean;
  deletePengumuman: (id: number) => void;
};

export default function CardAnnouncement({
  id,
  room,
  title,
  date,
  time,
  created_by,
  content,
  editForm,
  can_reply,
  can_edit,
  can_delete,
    deletePengumuman
}: EditPengumuman) {


  return (
    <>
      <div className="p-2 bg-white rounded-lg hover:cursor-default">
        <div className="flex flex-col gap-2 p-2 rounded-lg ">
          <div className="flex flex-row items-center gap-2 text-sm justify-between" >
            <div>
              <span>• {created_by}</span>{" "}
              <span className="text-main-3">{date} </span>
            </div>

            <span className="float-right bg-orange text-white rounded-2xl p-2">{room.name}</span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>

          <p className="py-2" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="flex flex-row gap-4 text-sm">
            {can_reply && (
              <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200">
                <FaCommentAlt /> Reply
              </button>
            )}
            {can_edit && (
              <button
                className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200"
                onClick={() => {
                  editForm(id);
                }}
              >
                <FaEdit /> Edit
              </button>
            )}
            {can_delete && (
              <button
                className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200"
                onClick={() => {
                  deletePengumuman(id)
                }}
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
