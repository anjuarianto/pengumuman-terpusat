"use client";

import React from "react";
import {FaEdit} from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import DropdownNavbar from "@/components/DropdownNavbar";

const session = Cookies.get("session");
const email = session ? JSON.parse(session).email : undefined;
const role = session ? JSON.parse(session).role : undefined;

export default function Navbar() {
    const router = useRouter();
    const Logout = async () => {
        try {
            Cookies.remove("accessToken");
            router.push("/login");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="flex flex-col bg-light-blue text-white z-50 top-0">
                <div className="flex items-center justify-between px-4 py-2  text-white">
                    <Image alt="logo" src={logo} className=" w-auto h-auto max-h-10 md:max-h-20"/>
                </div>
                <div className="px-4 py-2 text-center font-bold text-2xl md:text-3xl cursor-default  text-black">
                    Pengumuman Terpusat
                </div>
                <div className="flex flex-col md:flex-row  md:items-center px-4 py-2 text-sm bg-dark-blue ">
          <span className="grow cursor-default md:text-lg">
            Selamat Datang di Website Pengumuman Terpusat Teknik Informatika
            Itera Untuk Mengetahui Informasi
          </span>
                    <span
                        className="flex flex-row items-center w-full md:w-fit gap-2 py-2 rounded-md mx-0 font-bold   ">
            
            <FaEdit/> {email} | ({role})
            <DropdownNavbar logout={Logout}/>
          </span>
                </div>
            </div>
        </>
    );
}
