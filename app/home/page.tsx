"use client";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Home Component
import RoomList from "@/components/Home/RoomList";
import ModalRoomList from "@/components/Home/ModalRoomList";
import PengumumanList from "@/components/Home/PengumumanList";
// import PengumumanModal from "@/components/Home/PengumumanModal";
import Toolbar from "@/components/Home/Toolbar";
import UpcomingWidget from "@/components/Home/UpcomingWidget";
import Calendar from "@/components/Home/Calendar";
import MyPengumumanModal from "@/components/Home/MyPengumumanModal";
import FilterModal from "@/components/Home/FilterModal";
import dynamic from "next/dynamic";
import { Button } from "@mui/material";

const PengumumanModal = dynamic(
  () => import("@/components/Home/PengumumanModal"),
  {
    ssr: false,
  }
);

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

  const [meta, setMeta] = useState<{ currentPage: number; lastPage: number }>({
    currentPage: 1,
    lastPage: 1,
  });

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
  const [isMyPengumumanOpen, setMyPengumumanOpen] = useState<string | null>();
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<
    [
      {
        order: string;
        min_date: string;
        max_date: string;
        pengirim: string;
        kategori: string;
        penerima_id: number[];
        jenis: string;
        file_name: string;
      }
    ]
  >([
    {
      order: "desc",
      min_date: "",
      max_date: "",
      pengirim: "",
      jenis: "",
      penerima: [],
      file_name: "",
    },
  ]);

  const [yaLogin, setLogin] = useState<boolean | null>(null);

  const isLogin = async () => {
    try {
      const response = await axios.get("/api/me", {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      if (response.data.message === "Unauthenticated") {
        setLogin(false);
        return;
      }

      setLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const openRoomModal = () => {
    setIsOpenRoomModal(true);
  };

  const toggleModalPengumuman = () => {
    setIsModalOpenPengumuman(!isModalOpenPengumuman);
  };

  const loadMyData = async () => {
    try {
      const response = await axios.get("/api/me", {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      setMyData(response.data);

      const pengumumanData = response.data.pengumuman.map((data: any) => ({
        start: data.waktu,
        end: data.waktu,
        display: "background",
      }));

      const upcomingEventData = response.data.upcoming_event.map(
        (data: any) => ({
          id: data.id,
          judul: data.judul,
          waktu: data.waktu,
        })
      );

      setCalendarData(pengumumanData);
      setUpcomingEvent(upcomingEventData);
    } catch (err) {
      console.log(err);
    }
  };

  const searchForm = useForm<any>();

  useEffect(() => {
    loadMyData();
    isLogin();
  }, []);

  useEffect(() => {
    if (yaLogin != null) {
      loadPengumumanData(meta.currentPage);
    }
  }, [yaLogin]);

  useEffect(() => {
    if (!isModalOpenPengumuman) {
      loadPengumumanData(meta.currentPage);
    }

    if (navigate) {
      router.push("/user");
    }

    if (navigate) {
      loadMyData();
    }

    if (!openCal) {
      loadMyData();
    }

    setReloadPengumuman(false);
  }, [
    isModalOpenPengumuman,
    reloadPengumuman,
    openCal,
    roomId,
    navigate,
    filterValue,
  ]);

  const loadPengumumanData = async (page: any) => {
    try {
      const API_URL_PENGUMUMAN = "/api/pengumuman";
      const API_URL_PUBLIK = "/api/pengumuman-publik";
      const url = yaLogin ? API_URL_PENGUMUMAN : API_URL_PUBLIK;
      const response = await axios.get(url, {
        params: {
          search: searchForm.getValues().search,
          page: page,
          order: filterValue?.order,
          min_date: filterValue?.min_date,
          max_date: filterValue?.max_date,
          room_id: filterValue?.kategori,
          pengirim: filterValue?.pengirim,
          is_private: filterValue?.jenis,
          penerima_id: filterValue?.penerima_id,
          file_name: filterValue?.file_name,
        },
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      const pengumumanData: Pengumuman[] = response.data.data.data;
      console.log(response.data.data.meta.current_page);
      setMeta({
        currentPage: response.data.data.meta.current_page,
        lastPage: response.data.data.meta.last_page,
      });
      setPengumuman(pengumumanData);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (pageNumber: any) => {
    setMeta({ ...meta, currentPage: pageNumber });
    loadPengumumanData(pageNumber);
  };

  const tokenCheck = async () => {
    try {
      const accToken = Cookies.get("accessToken");
      // if (!accToken || accToken.length == 0) {
      //     router.push("/login");
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => {
    setIsModalOpenPengumuman(true);
  };

  const handleRoomIdChange = (id: number) => {
    setRoomId(id);
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
    console.log(event.target.value);
    searchForm.setValue("search", event.target.value);
    loadPengumumanData(meta.currentPage);
  };

  return (
    <>
      <Navbar email={myData?.email} role={myData?.role}></Navbar>
      <div className="flex flex-col items-center w-full h-full md:pt-16 ">
        <Toolbar
          onSubmitSearch={searchForm.handleSubmit(handleInputChange)}
          openModalFormPengumuman={toggleModalPengumuman}
          openFilterModal={() => setFilterModalOpen(true)}
          handleInputChange={handleInputChange}
          myData={myData}
          roomActive={roomId}
          setRoomId={() => {
            setRoomId(1);
          }}
        />

        {/* pagination */}
        <div className="flex flex-row itmes-center gap-2">
          <Button
            className="bg-blue-500 text-white p-1"
            variant="contained"
            onClick={() => {
              handlePageChange(meta.currentPage - 1);
            }}
          >
            prev page
          </Button>

          {meta.currentPage != 1 && (
            <div
              className="px-4 py-2 rounded-md  m-auto text-white bg-slate-700 transition cursor-default hover:cursor-default hover:bg-sky-600"
              onClick={() => {
                handlePageChange(1);
              }}
            >
              1
            </div>
          )}

          <div className="px-4 py-2 rounded-md  m-auto text-white border-2 border-sky-600 bg-slate-700">
            {meta.currentPage}
          </div>

          {meta.currentPage != meta.lastPage && (
            <div
              className="px-4 py-2 rounded-md  m-auto text-white bg-slate-700 transition cursor-default hover:cursor-default hover:bg-sky-600"
              onClick={() => {
                handlePageChange(meta.lastPage);
              }}
            >
              7
            </div>
          )}

          {meta.lastPage !== meta.currentPage && (
            <Button
              className="bg-blue-500 text-white p-1"
              variant="contained"
              onClick={() => {
                handlePageChange(meta.currentPage + 1);
              }}
            >
              next page {meta.lastPage}
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center w-full md:h-screen  md:px-12 ">
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
          {yaLogin ? (
            <div className="flex flex-col w-full md:w-2/5 md:h-screen gap-4 ">
              <Calendar
                openMyPengumuman={(date: string) => {
                  setMyPengumumanOpen(date);
                }}
                myCalendarData={calendarData}
              />

              <UpcomingWidget events={upcomingEvent}></UpcomingWidget>
            </div>
          ) : (
            ""
          )}
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

      <MyPengumumanModal
        isOpen={!!isMyPengumumanOpen}
        date={isMyPengumumanOpen}
        onClose={() => setMyPengumumanOpen(false)}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterValue={(filter) => {
          setFilterValue(filter);
          loadPengumumanData(meta.currentPage);
        }}
      ></FilterModal>
    </>
  );
}
