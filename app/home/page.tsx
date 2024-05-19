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
  const [filter, setFilter] = useState({
    order: null,
    min_date: null,
    max_date: null,
    jenis: null,
    kategori: null,
    pengirim: null,
    penerima_id: null,
    file_name: null,
  });

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

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMyData();
    isLogin();
  }, []);

  useEffect(() => {
    if (yaLogin != null) {
      // loadPengumumanData(meta.currentPage);
    }
  }, [yaLogin]);

  useEffect(() => {
    if (!isModalOpenPengumuman) {
      // loadPengumumanData(meta.currentPage);
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
  ]);

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

  const handleApplyFilter = (newFilter:any) => {
    setFilter(newFilter);
  };

  const handleClosePengumumanModal = () => {
    setIsModalOpenPengumuman(false);
    setpengumumanIsEdit(null);
    setReloadPengumuman(true);
  };

  const editForm = async (id: number) => {
    setpengumumanIsEdit(id);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <Navbar email={myData?.email} role={myData?.role}></Navbar>
      <div className="flex flex-col items-center w-full h-full md:pt-16 ">
        <Toolbar
          // onSubmitSearch={searchForm.handleSubmit(handleInputChange)}
          openModalFormPengumuman={toggleModalPengumuman}
          openFilterModal={() => setFilterModalOpen(true)}
          handleSearchChange={handleSearchChange}
          myData={myData}
          roomActive={roomId}
          setRoomId={() => {
            setRoomId(1);
          }}
        />

        <div className="flex flex-col md:flex-row justify-center w-full md:h-screen  md:px-12 ">
          <PengumumanList
            editForm={(id) => {
              toggleModalPengumuman();
              editForm(id);
            }}
            filter={filter}
            search={search}
            load={reloadPengumuman}
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
        filterValue={handleApplyFilter}
      ></FilterModal>
    </>
  );
}
