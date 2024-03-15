"use client";
import React, { useState, useEffect } from "react";
import { FaCalendarPlus, FaPlus, FaSearch } from "react-icons/fa";
import CardAnnouncement from "@/components/CardAnnouncement";
import { Modal } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import RoomList from "@/components/Home/RoomList";
import ModalRoomList from "@/components/Home/ModalRoomList";
import { PengumumanList } from "@/components/Home/PengumumamanList";
import PengumumanModal from "@/components/Home/PengumumanModal";

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
  const [roomOptions, setRoomOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [seachData, setSearchData] = useState<string>("");
  const [pengumumanIsEdit, setpengumumanIsEdit] = useState<number>();
  const [openCal, setOpenCal] = useState(false);
  const [isOpenRoomModal, setIsOpenRoomModal] = useState(false);

  const openRoomModal = () => {
    setIsOpenRoomModal(true);
  };

  const reloadRoomData = async () => {
    try {
      await loadRoomData();
    } catch (error) {
      console.error("Error reloading room data:", error);
    }
  };

  const closeRoomModal = () => {
    setIsOpenRoomModal(false);
    loadRoomData();
  };

  const searchForm = useForm<any>();

  useEffect(() => {
    tokenCheck().then(() => {
      loadPengumumanData();
      loadRoomData();
    });

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadPengumumanData = async (search?: string) => {
    try {
     console.log(search+ "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")

      const response = await axios.get(
        "http://127.0.0.1:8000/api/pengumuman",

        {
          params: {
            search: search,
            page: 1,
          },
          headers: {
            Authorization:
              // "Bearer 27|HBtoUhr6TVjtV0CB0YKzwobzPWogxoIZGzkV8fK7ae8863d4",
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

  const loadRoomData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/room",

        {
          headers: {
            Authorization:
              // "Bearer 1|BHGEg2Zf3jETFJiAcK1II0Axlx9We6t03DNZuYuT34d7f4b6",
              "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      // Map the data into the desired structure
      const mappedData = response.data.data.map((room: any) => ({
        value: room.id,
        label: room.name,
      }));
      // Set the mapped data into state
      setRoomOptions(mappedData);
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenCal(false);
  };

  const handleCloseModal = () => {
    setpengumumanIsEdit(undefined);
    setOpen(false);
  };

  const editForm = async (id: number) => {
    setpengumumanIsEdit(id);
    handleOpen();
    console.log(id);
  };

  const onSubmitSearch: SubmitHandler<any> = async (data) => {
    console.log(data.search.replace(" ", '+')); // Log the original data with spaces
  

  };

  const handleInputChange = (event: any) => {

    loadPengumumanData(event.target.value);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center w-full h-full pt-16 ">
        <div className="w-3/5 py-2 px-10">
          <div className="flex flex-row items-center gap-4 text-white">
            <div
              className="flex flex-row items-center gap-2 px-6 py-2 transition-all  rounded-lg shadow-md basis-1/5 bg-orange hover:bg-orange-h hover:shadow-lg hover:cursor-pointer"
              onClick={handleOpen}
            >
              <FaCalendarPlus />
              <span>Add News </span>
            </div>
          
            <form
              className="relative w-full mx-auto text-gray-600 "
              onSubmit={searchForm.handleSubmit(onSubmitSearch)}
            >
              <input
                className="h-10 px-5 pr-16 text-sm w-full bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
                type="search"
                placeholder="Search"
                {...searchForm.register("search", {
                  onChange: handleInputChange,
                })}
              />
              <button
                type="submit"
                className="absolute top-0 right-0 mt-3 mr-4"
              >
                <FaSearch />
              </button>
            </form>

            <div className="px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 bg-orange">
              General
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center w-full h-screen px-12">
          {/* roomlist  */}
          <RoomList
            openModal={openRoomModal}
            reloadRoomData={reloadRoomData}
          ></RoomList>

          {/* main content */}

          <div className="w-3/5 h-screen ">
            <div className="flex flex-col gap-4 m-2 rounded-lg ">
              {pengumuman.map((data, index) => (
                <CardAnnouncement
                  key={index}
                  id={data.id}
                  room={{ value: data.created_by, label: data.created_by }}
                  title={data.judul}
                  date={data.waktu}
                  time={data.waktu}
                  room_id={data.id}
                  content={data.konten}
                  editForm={() => editForm(data.id)}
                  can_reply={data.can_reply}
                  can_edit={data.can_edit}
                  can_delete={data.can_delete}
                />
              ))}
            </div>
          </div>

          {/* <PengumumanList pengumuman={pengumuman} editForm={editForm} /> */}

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

            <div className="p-6 m-2 bg-white rounded-lg ">
              <h2 className="py-2 text-xl text-center ">Upcoming</h2>
              <div className="divide-y ">
                <div className="flex flex-col px-2 py-1 ">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 ">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 ">
                  <span className="font-bold">Judul 1</span>{" "}
                  <span className="text-sm">15 January 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PengumumanModal
        openModal={open}
        roomOptions={roomOptions}
        onClose={handleCloseModal}
        isEdit={pengumumanIsEdit}
      ></PengumumanModal>

      {/* modal for calendar */}
      <Modal open={openCal}>
        <div
          className="flex flex-col items-center justify-center h-screen"
          onClick={handleClose}
        >
          <div
            className="flex flex-col items-center w-3/5 h-auto bg-white rounded-lg shadow-lg "
            onClick={(e) => {
              //Prevent event propagation only for this inner div
              e.stopPropagation();
            }}
          >
            <div className="w-full h-full py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
              Calendar
            </div>
            <div className="w-full px-24 py-4">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                headerToolbar={{
                  left: "prev,today,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: true,
                }}
                // customButtons={{
                //   addEvent: {
                //     text: "add event",
                //     click: () => {},
                //   },
                // }}
                initialView="dayGridMonth"
                events={[
                  {
                    title: "event 1",
                    start: "2024-03-11T10:00:00",
                    end: "2024-03-11T11:00:00",
                  },
                  {
                    title: "event 1.5",
                    start: "2024-03-11T15:00:00",
                    end: "2024-03-11T11:00:00",
                  },
                  {
                    title: "event 2",
                    start: "2024-03-21T10:00:00",
                    end: "2024-03-23T11:00:00",
                  },
                ]}
              />
            </div>
          </div>
          {/* </div> */}
        </div>
      </Modal>

      <ModalRoomList
        isOpen={isOpenRoomModal}
        onClose={() => {
          setIsOpenRoomModal(false);
          reloadRoomData();
        }}
      ></ModalRoomList>
    </>
  );
}
