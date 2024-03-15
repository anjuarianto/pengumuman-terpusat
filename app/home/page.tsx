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
import Swal from "sweetalert2";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

import RoomList from "@/components/Home/RoomList";
// import ModalRoomList from "@/components/Home/ModalRoomList";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "undo",
    "redo",
  ],
};

type PengumumanData = {
  room: { value: string; label: string }[];
  mahasiswa: { value: string; label: string }[];
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

  const [mahasiswaOptions, setMahasiswaOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [editorData, setEditorData] = useState<string>("");
  const [editorDataEdit, setEditorDataEdit] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [seachData, setSearchData] = useState<string>("");

  const [openCal, setOpenCal] = useState(false);
  const [roomSelected, setRoomSelected] = useState(false);
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
  const handleRoomChange = async (value: any) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/room/${value.value}`,

        {
          headers: {
            Authorization:
              // "Bearer 1|BHGEg2Zf3jETFJiAcK1II0Axlx9We6t03DNZuYuT34d7f4b6",
              "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      const mappedData = response.data.data.members.map((mahasiswa: any) => ({
        value: (mahasiswa.is_single_user ? 1 : 0) + "|" + mahasiswa.id,
        label: mahasiswa.name,
      }));

      setMahasiswaOptions(mappedData);

      setRoomSelected(!!value);
    } catch (err) {}
  };

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

  const loadPengumumanData = async (search?: string) => {
    try {
      if (search?.length !== 0) {
      }

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
    pengumumanForm.reset();
    setEditorData("");
    setOpen(false);
    setOpenCal(false);
  };

  const editForm = async (id: number) => {
    // const response = await axios.get(
    //   `http://127.0.0.1:8000/api/pengumuman/${id}`,

    //   {
    //     headers: {
    //       Authorization:
    //         // "Bearer 1|BHGEg2Zf3jETFJiAcK1II0Axlx9We6t03DNZuYuT34d7f4b6",
    //         "Bearer " + Cookies.get("accessToken"),
    //     },
    //   }
    // );

    console.log(id);
  };

  const onSubmit: SubmitHandler<PengumumanData> = async (data) => {
    try {
      console.log(data.mahasiswa);
      const formatedTime = data.date + " " + data.time;

      const cleanData = await {
        judul: data.title,
        room_id: data.room[0].value,
        waktu: formatedTime,
        konten: editorData,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/pengumuman",
        cleanData,
        {
          headers: {
            Authorization:
              // "Bearer 27|HBtoUhr6TVjtV0CB0YKzwobzPWogxoIZGzkV8fK7ae8863d4",
              "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      // Show success message with SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Success",
        customClass: {
          container: "my-swal-popup ",
        },
        text: "Success",
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          container: "my-swal-popup ",
        },
        text: "Failed",
      });
    }
  };

  const onSubmitSearch: SubmitHandler<any> = async (data) => {
    console.log(data);
    setSearchData(data);
  };
  const handleInputChange = (event: any) => {
    console.log("Search term changed:", event.target.value);

    loadPengumumanData(event.target.value);
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
                        isSearchable
                        options={roomOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleRoomChange}
                      />
                    )}
                  />
                </div>

                {roomSelected && (
                  <div>
                    <label className=" text-gray-700 font-bold">
                      Mahasiswa
                    </label>
                    <Controller
                      name="mahasiswa"
                      control={pengumumanForm.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Kepada :..."
                          isMulti
                          isSearchable
                          options={mahasiswaOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(value: any) => {
                            console.log(value);
                          }}
                        />
                      )}
                    />
                  </div>
                )}

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
                      <CKEditor
                        editor={Editor}
                        config={editorConfiguration}
                        data={editorData}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setEditorData(data);
                        }}
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
      <Modal open={openEdit}>
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
                        isSearchable
                        options={roomOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleRoomChange}
                      />
                    )}
                  />
                </div>

                {roomSelected && (
                  <div>
                    <label className=" text-gray-700 font-bold">
                      Mahasiswa
                    </label>
                    <Controller
                      name="mahasiswa"
                      control={pengumumanForm.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Kepada :..."
                          isMulti
                          isSearchable
                          options={mahasiswaOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(value: any) => {
                            console.log(value);
                          }}
                        />
                      )}
                    />
                  </div>
                )}

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
                      // <CustomEditor
                      //   initialData={value}
                      //   setValue={onChange} // Pass setValue function to update form field value
                      //   register={pengumumanForm.register("content")}
                      // />
                      <CKEditor
                        editor={Editor}
                        config={editorConfiguration}
                        data={editorData}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setEditorData(data);
                        }}
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
      {/* <ModalRoomList isOpen={isOpenRoomModal} onClose={() => setIsOpenRoomModal(false)}></ModalRoomList> */}
    </>
  );
}
