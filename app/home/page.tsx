"use client";
import React, { useState, useEffect } from "react";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import redirect from "next/navigation";

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
  penerima: { penerima_id: number; name: string; is_single_user: boolean }[];
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
  const [calendarData, setCalendarData] = useState<any>();
  const [upcomingEvent, setUpcomingEvent] = useState<any>();
  const [myData, setMyData] = useState<any>();
  const [roomId, setRoomId] = useState<number>(1);
  const [navigate, setNavigate] = useState("");

  const openRoomModal = () => {
    setIsOpenRoomModal(true);
  };

  const toggleModalPengumuman = () => {
    setIsModalOpenPengumuman(!isModalOpenPengumuman);
  };

    const loadMyData = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/me",
                {
                    headers: {
                        Authorization:
                            "Bearer " + Cookies.get("accessToken"),
                    },
                }
            );

            setMyData(response.data);

            const pengumumanData = response.data.pengumuman.map((data: any) => ({
                title: data.judul,
                start: data.waktu,
                end: data.waktu,
            }));

            const upcomingEventData = response.data.upcoming_event.map((data: any) => ({
                id: data.id,
                judul: data.judul,
                waktu: data.waktu
            }));


            setCalendarData(pengumumanData);
            setUpcomingEvent(upcomingEventData)
        } catch (err) {
            console.log(err);
        }
    };

  const searchForm = useForm<any>();

  useEffect(() => {
    tokenCheck().then(() => {
      if(!isModalOpenPengumuman) {
        loadPengumumanData();
      }

      if(navigate) {
        router.push("/user");
      }

      if(navigate) {
        loadMyData();
      }

      if(!openCal) {
        loadMyData();
      }
      setReloadPengumuman(false)
    });

  }, [isModalOpenPengumuman, reloadPengumuman, openCal, roomId, navigate]);

  const loadPengumumanData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pengumuman",

        {
          params: {
            search: searchForm.getValues().search,
            room_id: roomId,
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

  const handleRoomIdChange = (id) => {
      setRoomId(id);
    }

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
      <Navbar>
      </Navbar>
      <div className="flex flex-col items-center w-full h-full pt-16 ">

        <Toolbar
            openModalFormPengumuman={toggleModalPengumuman}
            handleInputChange={handleInputChange}
            myData={myData}
            roomActive={roomId}
            setRoomId={() =>{
                setRoomId(1);
            }}
        />

        <div className="flex flex-row justify-center w-full h-screen px-12">

          <RoomList
            openModal={openRoomModal}
            isModalOpen={isOpenRoomModal}
            setRoomId={(id: string) => handleRoomIdChange(parseInt(id))}
            roomActive={roomId}
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

            <UpcomingWidget events={upcomingEvent}>

            </UpcomingWidget>
          </div>
        </div>
      </div>

      <PengumumanModal
          isModalOpen={isModalOpenPengumuman}
          onClose={handleClosePengumumanModal}
          isEdit={pengumumanIsEdit}
          roomActive={roomId}
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
        myCalendarData={calendarData}
      />


    </>
  );
}
