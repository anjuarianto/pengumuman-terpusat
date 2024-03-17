"use client";
import React, { useState, useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Home Component
import RoomList from "@/components/Home/RoomList";
import ModalRoomList from "@/components/Home/ModalRoomList";
import  PengumumanList from "@/components/Home/PengumumanList";
import PengumumanModal from "@/components/Home/PengumumanModal";
import Toolbar from "@/components/Home/Toolbar";
import CalendarModal from "@/components/Home/CalendarModal";
import UpcomingWidget from "@/components/Home/UpcomingWidget";

type Pengumuman = {
  created_by: string;
  id: number;
  judul: string;
  konten: string;
  waktu: string;
  can_reply: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

export default function Home() {
  const router = useRouter();
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [isModalOpenPengumuman, setIsModalOpenPengumuman] = useState(false);
  const [openCal, setOpenCal] = useState(false);
  const [isOpenRoomModal, setIsOpenRoomModal] = useState(false);
  const [pengumumanIsEdit, setpengumumanIsEdit] = useState<number | null>(null);
  const [reloadPengumuman, setReloadPengumuman] = useState(false);
  const openRoomModal = () => {
    setIsOpenRoomModal(true);
  };

  const toggleModalPengumuman = () => {
    setIsModalOpenPengumuman(!isModalOpenPengumuman);
  };

  const searchForm = useForm<any>();

  useEffect(() => {
    tokenCheck().then(() => {
      if(!isModalOpenPengumuman) {
        loadPengumumanData();
      }

      setReloadPengumuman(false)
    });
  }, [isModalOpenPengumuman, reloadPengumuman]);

  const loadPengumumanData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pengumuman",

        {
          params: {
            search: searchForm.getValues().search,
            page: 1,
          },
          headers: {
            Authorization:
              "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      const pengumumanData: Pengumuman[] = response.data.data.data;
      setPengumuman(pengumumanData);
    } catch (err) {
      console.log(err);
    }
  };

  const tokenCheck = async () => {
    try {
      const accToken = Cookies.get("accessToken");
      if (!accToken || accToken.length == 0) {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => {
    setIsModalOpenPengumuman(true);
  };

  const handleClose = () => {
    setOpenCal(false);
  };

    const handleClosePengumumanModal = () => {
        setIsModalOpenPengumuman(false);
        setpengumumanIsEdit(null);

    };

  const editForm = async (id: number) => {
    setpengumumanIsEdit(id);
  };



  const handleInputChange = (event: any) => {
    searchForm.setValue('search', event.target.value);
    loadPengumumanData();
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center w-full h-full pt-16 ">

        <Toolbar openModalFormPengumuman={toggleModalPengumuman} handleInputChange={handleInputChange} />

        <div className="flex flex-row justify-center w-full h-screen px-12">

          <RoomList
            openModal={openRoomModal}
            isModalOpen={isOpenRoomModal}
          ></RoomList>

          {/* pengumuman */}
          <PengumumanList
              pengumuman={pengumuman}
              editForm={(id) => {
                toggleModalPengumuman();
                editForm(id);
              }}
              reload={() => {
                setReloadPengumuman(true);
              }}
          />


          {/* calendar and upcoming */}
          <div className="flex flex-col w-1/5 h-screen gap-4 ">
            <div
              className="p-6 py-12 m-2 font-bold text-xl text-center bg-white rounded-lg hover:cursor-pointer"
              onClick={() => {
                setOpenCal(true);
              }}
            >
              Click to open calendar
            </div>

            <UpcomingWidget></UpcomingWidget>
          </div>
        </div>
      </div>

      <PengumumanModal
          isModalOpen={isModalOpenPengumuman}
          onClose={handleClosePengumumanModal}
          isEdit={pengumumanIsEdit}
      ></PengumumanModal>

      <ModalRoomList
          isOpen={isOpenRoomModal}
          onClose={() => {
            setIsOpenRoomModal(false);
          }}
      ></ModalRoomList>

      {/* modal for calendar */}
      <CalendarModal
          openCal={openCal}
          handleClose={handleClose}
      />


    </>
  );
}
