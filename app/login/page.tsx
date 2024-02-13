"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Login() {
  const router = useRouter();

  const loginForm = useForm<{ email: string; password: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    console.log(data)
    router.push("/home");

  };

  return (
    <>
      <div className="flex flex-row items-center justify-center w-screen h-screen ">
        <div className="w-[30em] p-16 rounded-lg bg-white shadow-lg">
          {/* title */}
          <div>
            <h1 className="text-2xl font-bold ">
              Sign Into Your Account
            </h1>
            <hr className="h-px my-4 border-2 border-blue-500 rounded-lg" />
          </div>

          {/* login form */}
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4 mt-4 "
          >
            <div className="flex flex-row items-center justify-center w-full gap-2 p-3 border border-gray-300 rounded-md hover:cursor-pointer" >
              <Image
                src="/assets/google-icon.png"
                alt="logo bank index"
                width={25}
                height={25}
              />
              <div className="">Google Sign-in</div>
            </div>
            <div>or</div>
            <input
              type="email"
              id="email"
              required
              placeholder="Your E-mail"
              className="w-full p-2 border-b border-gray-300"
              {...loginForm.register("email", { required: true })}
            />
            <div className="flex flex-row-reverse items-center w-full ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Your password"
                className="w-full p-2 border-b border-gray-300" // Add pr-10 for padding on the right side
                {...loginForm.register("password", { required: true })}
              />
              <button
                type="button"
                className="absolute p-3 text-xl cursor-pointer "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              className="px-12 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-md shadow-lg hover:bg-blue-800"
            >
              Login
            </button>
            <Link
              href={"/home"}
              className="pt-2 text-blue-500 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}