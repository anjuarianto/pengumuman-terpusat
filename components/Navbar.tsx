"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaSignOutAlt ,FaEdit  } from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
        <button
          className="flex flex-row items-center gap-2 w-fit px-4 py-2 rounded-md mx-12  hover:bg-dark-blue-h font-bold"
          onClick={()=>{router.push("/user")}}
        ><FaEdit/> Edit User</button>
        <button
          className="flex flex-row items-center gap-2 w-fit px-4 py-2 rounded-md mx-12  hover:bg-dark-blue-h font-bold"
          onClick={Logout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
