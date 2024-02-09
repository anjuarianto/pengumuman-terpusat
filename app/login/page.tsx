"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const loginForm = useForm<{ email: string; password: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    console.log(data)
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center w-screen h-screen bg-blue-600">
        <div className="w-[30em] p-16 rounded-lg bg-white shadow-lg">
          {/* title */}
          <div>
            <h1 className="text-black text-2xl font-bold">
              Sign Into Your Account
            </h1>
            <hr className="h-px border-2 rounded-lg border-blue-500 my-4" />
          </div>

          {/* login form */}
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4 mt-4 text-black"
          >
            <div className="w-full p-3 rounded-md border border-gray-300 flex flex-row justify-center items-center gap-2 hover:cursor-pointer" >
              <Image
                src="/assets/google-icon.png"
                alt="logo bank index"
                width={25}
                height={25}
              />
              <div className="text-black">Google Sign-in</div>
            </div>
            <div>or</div>
            <input
              type="email"
              id="email"
              placeholder="Your E-mail"
              className="w-full p-2 border-b border-gray-300"
              {...loginForm.register("email", { required: true })}
            />
            <div className="w-full flex flex-row-reverse items-center ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your password"
                className="w-full text-black p-2 border-b border-gray-300" // Add pr-10 for padding on the right side
                {...loginForm.register("password", { required: true })}
              />
              <button
                type="button"
                className="absolute p-3 cursor-pointer text-xl text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-600 shadow-lg text-white font-semibold px-12 py-3 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Login
            </button>
            <Link
              href={"/"}
              className=" pt-2 text-blue-500 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}