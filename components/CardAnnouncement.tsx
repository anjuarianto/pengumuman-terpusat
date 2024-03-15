"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

type EditPengumuman = {
  id: number;
  room: { value: string; label: string };
  title: string;
  date: string;
  time: string;
  room_id: number;
  content: string;
  editForm: (id: number) => void;
  can_reply: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

export default function CardAnnouncement({
  id,
  room,
  title,
  date,
  time,
  room_id,
  content,
  editForm,
  can_reply,
  can_edit,
  can_delete,
}: EditPengumuman) {
  const deletePengumuman = async () => {
    Swal.fire({
      title: `Delete ${title} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(room_id);

        const apiUrl = `http://127.0.0.1:8000/api/pengumuman/${room_id}`;
        await axios
          .delete(apiUrl, {
            headers: {
              Authorization:
                // "Bearer 1|BHGEg2Zf3jETFJiAcK1II0Axlx9We6t03DNZuYuT34d7f4b6",
                "Bearer " + Cookies.get("accessToken"),
            },
          })
          .then(async (response) => {
            await Swal.fire("Deleted!", response.data.message, "success");
          })
          .then(async () => {
            await window.location.reload();
          })
          .catch((error) => {
            Swal.fire("Gagal", error, "error");
          });
      }
    });
  };

  return (
    <>
      <div className="p-2 bg-white rounded-lg hover:cursor-default">
        <div className="flex flex-col gap-2 p-2 rounded-lg ">
          <div className="flex flex-row items-center gap-2 text-sm ">
            <span>• {room.label}</span>{" "}
            <span className="text-main-3">{date} </span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>

          <p className="py-2" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="flex flex-row gap-4 text-sm">
            {can_reply && (
              <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200">
                <FaCommentAlt /> Reply
              </button>
            )}
            {!can_edit && (
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
                onClick={deletePengumuman}
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
