"use client";
import React, { useState, useEffect } from "react";
import { FaCalendarPlus, FaPlus, FaSearch } from "react-icons/fa";
import CardAnnouncement from "@/components/CardAnnouncement";
import { Modal } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type PengumumanData = {
  room: { value: string; label: string }[];
  sender: string;
  title: string;
  date: string;
  time: string;
  content: string;
};

type Pengumuman = {
  created_by: string;
  id: number;
  judul: string;
  konten: string;
  waktu: string;
};

const PengumumanDummyData = [
  {
    receiver: { value: "John Doe", label: "John Doe" },
    title: "Important Meeting",
    date: "2024-02-13",
    time: "08:00",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet tellus quis felis vulputate, sit amet efficitur lorem placerat.",
  },
  {
    receiver: { value: "Olivia Taylor2", label: "Olivia Taylor" },
    title: "Upcoming Event",
    date: "2024-02-14",
    time: "10:30",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque enim et est bibendum, vel aliquam lacus placerat.",
  },
  {
    receiver: { value: "Michael Wilson", label: "Michael Wilson" },
    title: "Club Meeting",
    date: "2024-02-15",
    time: "13:45",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacinia justo ac urna condimentum, sit amet congue odio consequat.",
  },
  {
    receiver: { value: "Emily Brown", label: "Emily Brown" },
    title: "Guest Speaker Lecture",
    date: "2024-02-16",
    time: "16:00",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed enim a nunc tristique eleifend at eget leo.",
  },
  {
    receiver: { value: "Ava Garcia", label: "Ava Garcia" },
    title: "Seminar Announcement",
    date: "2024-02-17",
    time: "19:15",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et enim eu nunc suscipit aliquam nec vitae purus.",
  },
];

const CustomEditor = dynamic(
  () => {
    return import("../../components/Editor");
  },
  { ssr: false }
);

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
  const [openCal, setOpenCal] = useState(false);
  // const [editorLoaded, setEditorLoaded] = useState(true);
  // const [data, setData] = useState("");

  const pengumumanForm = useForm<PengumumanData>({
    mode: "onChange",
  });

  const searchForm = useForm<any>();

  useEffect(() => {
    tokenCheck().then(() => {
      loadPengumumanData();
      loadRoomData();
    });

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const loadPengumumanData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pengumuman",

        {
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
      console.log(response.data.data);

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
    pengumumanForm.reset();
    setOpen(false);
    setOpenCal(false)
  };

  const onSubmit: SubmitHandler<PengumumanData> = async (data) => {
    const cleanData = {
      title: data.title,
      room: data.room[0].value,
      sender: "sender",
      date: data.date,
      time: data.time,
      content: data.content,
    };
    console.log(cleanData);
  };
  const onSubmitSearch: SubmitHandler<any> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center w-full h-full pt-16 ">
        <div className="w-2/5 p-2 ">
          <div className="flex flex-row items-center gap-4 text-white">
            <div
              className="flex flex-row items-center gap-2 px-6 py-2 transition-all  rounded-lg shadow-md basis 1/5 bg-orange hover:bg-orange-h hover:shadow-lg hover:cursor-pointer"
              onClick={handleOpen}
            >
              <FaCalendarPlus />
              <span>Add News </span>
            </div>
            {/* <form className="px-2 py-1 my-2 text-center border border-white rounded-full shadow-lg basis-3/5 bg-orange">
              search ...
            </form> */}
            <form
              className="relative mx-auto text-gray-600 "
              onSubmit={searchForm.handleSubmit(onSubmitSearch)}
            >
              <input
                className="h-10 px-5 pr-16 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
                type="search"
                placeholder="Search"
                {...searchForm.register("search")}
              />
              <button
                type="submit"
                className="absolute top-0 right-0 mt-3 mr-4"
              >
                {/* <svg
                  className="w-4 h-4 text-gray-600 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56.966 56.966"
                  width="512px"
                  height="512px"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg> */}
                <FaSearch />
              </button>
            </form>

            <div className="px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 bg-orange">
              General
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center w-2/3 h-screen ">
          {/* roomlist  */}
          <div className="w-1/5 h-screen ">
            <div className="p-6 m-2 bg-white rounded-lg">
              <div className="flex flex-row ">
                <h2 className="text-left grow ">Room List</h2>{" "}
                <FaPlus className="p-1 text-2xl hover:cursor-pointer"></FaPlus>
              </div>
                
              {roomOptions.map((data, index) => (
                <div key={index} className="px-2 py-1 my-2 text-center text-white rounded-lg shadow-lg bg-orange hover:bg-orange-h">
                {data.label}
              </div>
              ))}
              
              <div className="px-2 py-1 my-2 text-center text-white rounded-lg shadow-lg bg-orange hover:bg-orange-h">
                Room 1
              </div>
              <div className="px-2 py-1 my-2 text-center text-white rounded-lg shadow-lg bg-orange hover:bg-orange-h">
                Room 2
              </div>
            </div>
          </div>

          {/* main content */}
          <div className="w-3/5 h-screen ">
            <div className="flex flex-col gap-4 m-2 rounded-lg ">
  
              {pengumuman.map((data, index) => (
                <CardAnnouncement
                  key={index}
                  receiver={{ value: data.created_by, label: data.created_by }}
                  title={data.judul}
                  date={data.waktu}
                  time={data.waktu}
                  content={data.konten}
                />
              ))}
            </div>
          </div>

          {/* calendar and upcoming */}
          <div className="flex flex-col w-1/5 h-screen gap-4 ">
            <div className="p-6 py-12 m-2 font-bold text-xl text-center bg-white rounded-lg hover:cursor-pointer" onClick={()=>{setOpenCal(true)}}>
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

      <Modal open={open}>
        <div
          className="flex flex-col items-center justify-center h-screen"
          onClick={handleClose}
        >
          <div
            className="flex flex-col items-center w-2/5 h-auto bg-white rounded-lg shadow-lg "
            onClick={(e) => {
              //Prevent event propagation only for this inner div
              e.stopPropagation();
            }}
          >
            <div className="w-full h-full py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
              Add Pengumuman
            </div>
            <div className="w-full px-24 py-4">
              <form
                onSubmit={pengumumanForm.handleSubmit(onSubmit)}
                className="flex flex-col w-full gap-4"
              >
                <div>
                  <label className=" text-gray-700 font-bold">Room</label>
                  <Controller
                    name="room"
                    control={pengumumanForm.control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Kepada :..."
                        isMulti
                        isSearchable
                        options={roomOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className=" text-gray-700 font-bold">Judul</label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="Judul : ..."
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...pengumumanForm.register("title", { required: true })}
                  />
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">Waktu</label>

                  <div className="flex flex-row gap-2">
                    <input
                      type="date"
                      id="date"
                      required
                      className="p-2 border border-gray-300 rounded-md basis-1/2"
                      {...pengumumanForm.register("date", { required: true })}
                    />
                    <input
                      type="time"
                      id="time"
                      required
                      className="p-2 border border-gray-300 rounded-md basis-1/2"
                      {...pengumumanForm.register("time", { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">Konten</label>
                  <Controller
                    name="content"
                    control={pengumumanForm.control}
                    render={({ field: { onChange, value } }) => (
                      <CustomEditor
                        initialData={value}
                        setValue={onChange} // Pass setValue function to update form field value
                        register={pengumumanForm.register("content")}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    className="px-24 py-2 mt-4 text-white bg-blue-500 rounded-lg w-fit hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* </div> */}
        </div>
      </Modal>
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
    </>
  );
}
