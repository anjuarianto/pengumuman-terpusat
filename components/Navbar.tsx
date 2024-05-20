"use client";

import React, {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import DropdownNavbar from "@/components/DropdownNavbar";
import Button from "@mui/material/Button";
import axios from "axios";

type Props = {
    email: string;
    role: string;
};


export default function Navbar({email, role}: Props) {
    const router = useRouter();
    const [yalogin, setLogin] = useState<boolean>(false);

    const Logout = async () => {
        try {
            Cookies.remove("accessToken");
            router.push("/login");
        } catch (err) {
            console.log(err);
        }
    };

    const isLogin = async () => {
        try {
            const response = await axios.get(
                "/api/me",
                {
                    headers: {
                        Authorization:
                            "Bearer " + Cookies.get("accessToken"),
                    },
                }
            );

            if(response.data.message === 'Unauthenticated') {
                setLogin(false);
            } else {
                setLogin(true)
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        isLogin();
    }, []);

    return (
        <>
            <div className="flex flex-col bg-light-blue text-white z-50 top-0">
                <div className="flex items-center justify-between px-4 py-2  text-white">
                    <Image alt="logo" src={logo} className=" w-auto h-auto max-h-10 md:max-h-20"/>
                </div>
                <div className="px-4 py-2 text-center font-bold text-2xl md:text-3xl cursor-default  text-black">
                    Pusat Informasi
                </div>
                <div className="flex flex-col md:flex-row  md:items-center px-4 py-2 text-sm bg-dark-blue ">
          <span className="grow cursor-default md:text-lg">
            Selamat Datang di Website Pusat Informasi Teknik Informatika
            Itera Untuk Mengetahui Informasi
          </span>

                    {yalogin ? (
                        <span
                            className="flex flex-row items-center w-full md:w-fit gap-2 py-2 rounded-md mx-0 font-bold   ">

            <FaEdit/> {email} | ({role})
            <DropdownNavbar role={role} logout={Logout}/>
          </span>
                    ) : (
                        <span><Button
                            style={{backgroundColor: "#2b507c", color: "white"}}
                            size="small"
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={() => router.push("/login")}
                        >Masuk</Button>
                        </span>
                    )}

                </div>
            </div>
        </>
    );
}
