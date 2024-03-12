"use client";
import React, { useState } from "react";

import { FaEdit, FaTrash, FaCommentAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";


export default function CardAnnouncement({
  receiver,
  title,
  date,
  time,
  room_id,
  content,
}: {
  receiver: { value: string; label: string };
  title: string;
  date: string;
  time: string;
  room_id:number;
  content: string;
}) {


  const deletePengumuman = async ()=>{

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
        console.log(room_id)

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
            await Swal.fire(
              "Deleted!",
              response.data.message,
              "success"
            );
          })
          .then(async () => {
            await window.location.reload();
          })
          .catch((error) => {
            Swal.fire(
              "Gagal",
              error,
              "error"
            );
          });
      }
    });
  }


  return (
    <>
      <div className="p-2 bg-white rounded-lg hover:cursor-default">
        <div className="flex flex-col gap-2 p-2 rounded-lg ">
          <div className="flex flex-row items-center gap-2 text-sm ">
            <span>• {receiver.label}</span>{" "}
            <span className="text-main-3">{date} </span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>

          <p className="py-2" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="flex flex-row gap-4 text-sm">
            <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg hover:bg-gray-200">
              <FaCommentAlt /> Reply
            </button>
            <button className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg ">
              <FaEdit /> Edit
            </button>
            <button
              className="flex flex-row items-center gap-2 px-4 py-1 border rounded-lg "
              onClick={deletePengumuman}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
