"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
type EditPengumuman = {
  id: number;
  room: { id: number; name: string };
  title: string;
  date: string;
  time: string;
  created_by: string;
  room_id: number;
  content: string;
  penerima: { penerima_id: number; name: string; is_single_user: boolean; }[];
  editForm: (id: number) => void;
  can_reply: boolean;
  can_edit: boolean;
  can_delete: boolean;
  deletePengumuman: (id: number) => void;
  openDetailModal: (id:number) => void;
  files:{file:string; original_name:string}[];
};

export default function CardAnnouncement({
  id,
  room,
  title,
  date,
  time,
  created_by,
  content,
    penerima,
  editForm,
  can_reply,
  can_edit,
  can_delete,
  deletePengumuman,
    openDetailModal,
    files
}: EditPengumuman) {
  const router = useRouter();
  console.log(penerima);




  return (
    <>
      <div className="p-2 bg-white rounded-lg hover:cursor-default" onClick={() => openDetailModal(id)}>
        <div className="flex flex-col gap-2 p-2 rounded-lg ">
          <div className="flex flex-row items-center gap-2 text-sm justify-between">
            <div>
              <span>Pengirim: {created_by}</span>{" "}
              <span className="text-main-3">Deadline: {date} </span>
            </div>
            <span className="float-right bg-orange text-white rounded-2xl p-2">
              {room.name}
            </span>
          </div>
          <div>
            Penerima: {penerima.length > 0 ? penerima.map((penerima) => penerima.name).join(", ") : '-'}
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        
          <p className="py-2" dangerouslySetInnerHTML={{ __html: content }} />
          
         
         

              
          <div className="flex flex-row gap-4 text-sm">
            {can_reply && (
              <button
                className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/home/${id}`)
                  }
                }
              >
                <FaCommentAlt /> Reply
              </button>
            )}
            {can_edit && (
              <button
                className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  editForm(id);
                }}
              >
                <FaEdit /> Edit
              </button>
            )}
            {can_delete && (
              <button
                className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePengumuman(id);
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
