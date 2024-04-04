"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaEye, FaEyeSlash, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type SessionType = {
  id: number;
  name: string;
  email: string;
  role: string;
} | null;

export default function Login() {
  const router = useRouter();

  const loginForm = useForm<{ email: string; password: string }>();
  const regisForm = useForm<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [session, setSession] = useState<SessionType>(null);

  useEffect(() => {
    tokenCheck();

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tokenCheck = async () => {
    try {
      const accToken = Cookies.get("accessToken");
      console.log(accToken);
      if (accToken) {
        router.push("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getSessionData = async (accesToken: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/me`, {
        headers: {
          Authorization: "Bearer " + accesToken,
        },
      });

      setSession(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitLogin: SubmitHandler<{
    email: string;
    password: string;
  }> = async (data) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        data
      );

      // Store token in cookie
      Cookies.set("accessToken", response.data.access_token);
      Cookies.set("session", JSON.stringify(response.data.session));

      router.push("/home");

      // Show success message with SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login failed. Please try again later.",
      });
    }
  };

  const onSubmitRegis: SubmitHandler<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = async (data) => {
    try {
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login failed. Please try again later.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="md:w-[30em]">
          <div className="w-full flex flex-row gap-2 ">
            <div
              className={`flex flex-row items-center justify-center gap-1 transform grow text-center py-2 rounded-t-lg shadow-t-lg  ${
                !isLoggedIn
                  ? "bg-main-4 text-white hover:cursor-pointer"
                  : "bg-white"
              }`}
              onClick={() => {
                setIsLoggedIn(true);
              }}
            >
              <FaSignInAlt></FaSignInAlt> Login
            </div>
            <div
              className={`flex flex-row items-center justify-center gap-1 transform grow text-center py-2 rounded-t-lg shadow-t-lg  ${
                isLoggedIn
                  ? "bg-main-4 text-white hover:cursor-pointer"
                  : "bg-white "
              }`}
              onClick={() => {
                setIsLoggedIn(false);
              }}
            >
              <FaUserPlus></FaUserPlus> Register
            </div>
          </div>

          <div className="w-full p-16 md:p-8 rounded-b-lg bg-white shadow-lg">
            {/* title */}
            <div>
              <h1 className="text-2xl font-bold ">
                {" "}
                {isLoggedIn ? "Sign Into Your Account" : "Sign Up Your Account"}
              </h1>
              <hr className="h-px my-4 border-2 border-blue-500 rounded-lg" />
            </div>

            {isLoggedIn === true ? (
              <>
                {/* login form */}
                <form
                  onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                  className="flex flex-col items-center gap-4 mt-4 "
                >
                  <div className="flex flex-row items-center justify-center w-full gap-2 p-3 border border-gray-300 rounded-md hover:cursor-pointer">
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
                  <input
                    type="hidden"
                    name="_token"
                    value="/sanctum/csrf-cookie"
                  />

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
              </>
            ) : (
              <>
                {/* register form */}
                <form
                  onSubmit={regisForm.handleSubmit(onSubmitRegis)}
                  className="flex flex-col items-center gap-4 mt-4 "
                >
                  <input
                    type="name"
                    id="name"
                    required
                    placeholder="Your Name"
                    className="w-full p-2 border-b border-gray-300"
                    {...regisForm.register("name", { required: true })}
                  />
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Your E-mail"
                    className="w-full p-2 border-b border-gray-300"
                    {...regisForm.register("email", { required: true })}
                  />
                  <div className="flex flex-row-reverse items-center w-full ">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      placeholder="Your password"
                      className="w-full p-2 border-b border-gray-300"
                      {...regisForm.register("password", {
                        required: true,
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />

                    <button
                      type="button"
                      className="absolute p-3 text-xl cursor-pointer "
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  {regisForm.formState.errors.password && (
                    <span className="mb-4 text-red-500">
                      Password must be at least 6 characters
                    </span>
                  )}

                  <div className="flex flex-row-reverse items-center w-full ">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      placeholder="Your password"
                      className="w-full p-2 border-b border-gray-300" // Add pr-10 for padding on the right side
                      {...regisForm.register("confirmPassword", {
                        validate: (value) =>
                          value === regisForm.watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      className="absolute p-3 text-xl cursor-pointer "
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  {regisForm.formState.errors.confirmPassword && (
                    <span className="mb-4 text-red-500">
                      Passwords do not match
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-24 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-md shadow-lg hover:bg-blue-800"
                  >
                    {isLoggedIn ? "Login" : "Register"}
                  </button>
                  {isLoggedIn && (
                    <>
                      <Link
                        href={"/home"}
                        className="pt-2 text-blue-500 hover:text-blue-700 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
