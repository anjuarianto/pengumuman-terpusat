"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaSignOutAlt ,FaEdit  } from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DropdownNavbar from "@/components/DropdownNavbar";

const session = Cookies.get("session");
const email = session ? JSON.parse(session).email : undefined;
const role = session ? JSON.parse(session).role : undefined;
export default function Navbar() {
  const router = useRouter();
  const Logout = async () => {
    try {
      Cookies.remove("accessToken");
      router.push("/login")
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" top-0 z-50 w-full   shadow  bg-light-blue">
      <Image alt="logo" src={logo} className="p-2"></Image>

      <div className="pb-4 text-center font-bold text-4xl cursor-default">
        Pengumuman Terpusat
      </div>

      <div className="flex flex-row items-center bg-dark-blue text-white px-4 py-2 ">
        <span className="grow cursor-default">
          {" "}
          Selamat Datang di Website Pengumuman Terpusat Teknik Informatika Itera
          Untuk Mengetahui Informasi
        </span>
        <span
          className="flex flex-row items-center w-fit gap-2 py-2 rounded-md mx-12 font-bold"
        ><FaEdit/>{email} | ({role})</span>

        <DropdownNavbar logout={Logout} />

      </div>
    </div>
  );
}
