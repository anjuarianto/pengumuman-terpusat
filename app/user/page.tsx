"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaAngleLeft } from "react-icons/fa";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableMeta,
} from "mui-datatables";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TableContainer, Paper, Tooltip, Modal } from "@mui/material";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

type Room = {
  id: number;
  name: string;
  description: string;
  members: {
    id: number;
    name: string;
    is_single_user: boolean;
  }[];
  created_at: string;
  updated_at: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};
interface Member {
  id: number;
  name: string;
  is_single_user: boolean;
}

type UserGroup = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export default function User() {
  const router = useRouter();

  const [openUser, setOpenUser] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [options, setOptions] = useState<string>("room");
  const [RoomData, setRoomData] = useState<Room[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [userGroupData, setUserGroupData] = useState<UserGroup[]>([]);

  const [editUserData, setEditUserData] = useState<{
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    isEdit: boolean;
  }>();

  const [editRoomData, setEditRoomData] = useState<{
    id: number;
    name: string;
    description: string;
    members: {
      id: number;
      name: string;
      is_single_user: boolean;
    }[];
    created_at: string;
    updated_at: string;
  }>();

  const UserForm = useForm<User>();
  const RoomForm = useForm<Room>();

  const columnsUserGroup: MUIDataTableColumn[] = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "name",
      label: "User Group Name",
    },

    {
      name: "created_at",
      label: "created_at",
    },
    {
      name: "updated_at",
      label: "updated_at",
    },

    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
          return (
            <>
              {
                <div className="flex flex-row gap-2">
                  <Tooltip title="Update User Group" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {}}
                    >
                      <FaEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Remove User Group" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg "
                      onClick={() => {
                        Swal.fire({
                          title: `Delete ${tableMeta.rowData[1]} ?`,
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            const apiUrl = `http://127.0.0.1:8000/api/user-group/${tableMeta.rowData[0]}`;
                            await axios
                              .delete(apiUrl, {
                                headers: {
                                  Authorization:
                                    "Bearer " + Cookies.get("accessToken"),
                                },
                              })
                              .then(async (response) => {
                                await Swal.fire(
                                  "Deleted!",
                                  response.data.message,
                                  "success"
                                );
                              })
                              .then(async () => {
                                await window.location.reload();
                              })
                              .catch((error) => {
                                Swal.fire(
                                  "Gagal",
                                  "Gagal menghapus kelas",
                                  "error"
                                );
                              });
                          }
                        });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </Tooltip>
                </div>
              }
            </>
          );
        },
      },
    },
  ];

  const columnsRoom: MUIDataTableColumn[] = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "name",
      label: "Room Name",
    },
    {
      name: "description",
      label: "Description",
    },
    {
      name: "members",
      label: "members",
      options: {
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
          return (
            <>
              <ul className="list-disc pl-4">
                {value.map((member: any, index: number) => (
                  <li key={index}>{member.name}</li>
                ))}
              </ul>
            </>
          );
        },
      },
    },

    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
          return (
            <>
              {
                <div className="flex flex-row gap-2">
                  <Tooltip title="Update Room" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {
                        setEditRoomData({
                          id: tableMeta.rowData[0],
                          name: tableMeta.rowData[1],
                          description: tableMeta.rowData[2],
                          members: tableMeta.rowData[3],
                          created_at: tableMeta.rowData[2],
                          updated_at: tableMeta.rowData[2],
                        })

                        handleOpen("edit", "room")
                      }}
                    >
                      <FaEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Remove Room" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg "
                      onClick={() => {
                        Swal.fire({
                          title: `Delete ${tableMeta.rowData[2]} ?`,
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            const apiUrl = `http://127.0.0.1:8000/api/room/${tableMeta.rowData[0]}`;
                            await axios
                              .delete(apiUrl, {
                                headers: {
                                  Authorization:
                                    "Bearer " + Cookies.get("accessToken"),
                                },
                              })
                              .then(async (response) => {
                                await Swal.fire(
                                  "Deleted!",
                                  response.data.message,
                                  "success"
                                );
                              })
                              .then(async () => {
                                await window.location.reload();
                              })
                              .catch((error) => {
                                Swal.fire(
                                  "Gagal",
                                  "Gagal menghapus kelas",
                                  "error"
                                );
                              });
                          }
                        });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </Tooltip>
                </div>
              }
            </>
          );
        },
      },
    },
  ];

  const columnsUser: MUIDataTableColumn[] = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "name",
      label: "User Name",
    },
    {
      name: "email",
      label: "Email",
    },
    // {
    //   name: "email_verified_at",
    //   label: "Email verified at",
    // },
    {
      name: "created_at",
      label: "created_at",
    },
    {
      name: "updated_at",
      label: "updated_at",
    },

    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
          return (
            <>
              {
                <div className="flex flex-row gap-2">
                  <Tooltip title="Update User" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {
                        setEditUserData({
                          id: tableMeta.rowData[0],
                          name: tableMeta.rowData[1],
                          email: tableMeta.rowData[2],
                          created_at: tableMeta.rowData[2],
                          updated_at: tableMeta.rowData[3],
                          isEdit: true,
                        });
                        console.log("whwtat????????????????");
                        handleOpen("edit", "user");
                      }}
                    >
                      <FaEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Remove User" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg "
                      onClick={() => {
                        Swal.fire({
                          title: `Delete ${tableMeta.rowData[2]} ?`,
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            const apiUrl = `http://127.0.0.1:8000/api/user/${tableMeta.rowData[0]}`;
                            await axios
                              .delete(apiUrl, {
                                headers: {
                                  Authorization:
                                    "Bearer " + Cookies.get("accessToken"),
                                },
                              })
                              .then(async (response) => {
                                await Swal.fire(
                                  "Deleted!",
                                  response.data.message,
                                  "success"
                                );
                              })
                              .then(async () => {
                                await window.location.reload();
                              })
                              .catch((error) => {
                                Swal.fire(
                                  "Gagal",
                                  "Gagal menghapus user",
                                  "error"
                                );
                              });
                          }
                        });
                      }}
                    >
                      <FaTrash />
                    </button>
                  </Tooltip>
                </div>
              }
            </>
          );
        },
      },
    },
  ];

  useEffect(() => {
    tokenCheck().then(() => {
      loadRoomData();
      loadUserGroupData();
      loadUserData();
    });

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const loadUserGroupData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user-group",

        {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
          },
        }
      );

      // Convert timestamps for created_at and updated_at
      const convertedData = response.data.data.map((user: any) => ({
        ...user,
        created_at: new Date(user.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        updated_at: new Date(user.updated_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));
      setUserGroupData(convertedData);

      console.log(convertedData);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUserData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user",

        {
          headers: {
            Authorization:
              // "Bearer 1|BHGEg2Zf3jETFJiAcK1II0Axlx9We6t03DNZuYuT34d7f4b6",
              "Bearer " + Cookies.get("accessToken"),
          },
        }
      );
      // Convert timestamps for created_at and updated_at
      const convertedData = response.data.map((user: any) => ({
        ...user,
        created_at: new Date(user.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        updated_at: new Date(user.updated_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));
      setUserData(convertedData);
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

      // Convert timestamps for created_at and updated_at
      const convertedData = response.data.data.map((room: any) => ({
        ...room,
        created_at: new Date(room.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        updated_at: new Date(room.updated_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));

      // Set the mapped data into state
      setRoomData(convertedData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleGoBack = () => {
    router.back(); // Navigate to previous route
  };

  const handleOpen = (options: string, dataType: string) => {
    if (options === "add" && dataType === "user") {
      UserForm.reset();
      setOpenUser(true);
    }
    if (options === "edit" && dataType === "user") {
      UserForm.reset();
      setOpenUser(true);
    }
    if (options === "add" && dataType === "room") {
      RoomForm.reset();
      setOpenRoom(true);
    }
    if (options === "edit" && dataType === "room") {
      RoomForm.reset();
      setOpenRoom(true);
    }
  };
  const handleClose = () => {
    setOpenUser(false);
    setOpenRoom(false);
  };
  const onSubmitRoom: SubmitHandler<Room> = async (data) => {
    console.log(data);
    // try {
    //   const response = await axios.post(
    //     "http://127.0.0.1:8000/api/pengumuman",
    //     cleanData,
    //     {
    //       headers: {
    //         Authorization:
    //           // "Bearer 27|HBtoUhr6TVjtV0CB0YKzwobzPWogxoIZGzkV8fK7ae8863d4",
    //           "Bearer " + Cookies.get("accessToken"),
    //       },
    //     }
    //   );
    //   // Show success message with SweetAlert2
    //   await Swal.fire({
    //     icon: "success",
    //     title: "Success",
    //     customClass: {
    //       container: "my-swal-popup ",
    //     },
    //     text: "Login successful!",
    //   });
    // } catch (err) {
    //   console.log(err);
    //   await Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     customClass: {
    //       container: "my-swal-popup ",
    //     },
    //     text: "Login failed. Please try again later.",
    //   });
    // }
  };
  const onSubmitUser: SubmitHandler<User> = async (data) => {
    const formatedData = {
      id: editUserData?.id,
      name: data.name,
      email: data.email,
      created_at: editUserData?.created_at,
      updated_at: editUserData?.updated_at,
    };
    console.log(formatedData);
    // try {
    //   const response = await axios.post(
    //     "http://127.0.0.1:8000/api/pengumuman",
    //     cleanData,
    //     {
    //       headers: {
    //         Authorization:
    //           // "Bearer 27|HBtoUhr6TVjtV0CB0YKzwobzPWogxoIZGzkV8fK7ae8863d4",
    //           "Bearer " + Cookies.get("accessToken"),
    //       },
    //     }
    //   );
    //   // Show success message with SweetAlert2
    //   await Swal.fire({
    //     icon: "success",
    //     title: "Success",
    //     customClass: {
    //       container: "my-swal-popup ",
    //     },
    //     text: "Login successful!",
    //   });
    // } catch (err) {
    //   console.log(err);
    //   await Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     customClass: {
    //       container: "my-swal-popup ",
    //     },
    //     text: "Login failed. Please try again later.",
    //   });
    // }
  };
  return (
    <>
      <Navbar></Navbar>
      <div className=" flex flex-col items-center w-full h-full pt-16 ">
        <div className="flex flex-row justify-center w-full h-screen px-12">
          <div className="w-full h-screen ">
            <div className="flex flex-row gap-4 items-center mb-6 ">
              <Tooltip title="Back to home" placement="top" arrow>
                <button
                  className="p-3  rounded-lg  bg-white hover:bg-dark-blue-h hover:text-white"
                  onClick={handleGoBack}
                >
                  <FaAngleLeft />
                </button>
              </Tooltip>
              <div
                className={`  w-fit  rounded-lg  shadow-lg 
            `}
              >
                <button
                  className={`${
                    options === "room"
                      ? "bg-dark-blue text-white"
                      : "bg-white hover:text-white hover:bg-dark-blue-h"
                  } rounded-l-lg px-4 py-2`}
                  onClick={() => setOptions("room")}
                >
                  Room List
                </button>
                {/* <button
                  className={`${
                    options === "usergroup"
                      ? "bg-dark-blue text-white"
                      : "bg-white hover:text-white hover:bg-dark-blue-h"
                  }  px-4 py-2`}
                  onClick={() => setOptions("usergroup")}
                >
                  User Group List
                </button> */}
                <button
                  className={`${
                    options === "user"
                      ? "bg-dark-blue text-white"
                      : "bg-white hover:text-white hover:bg-dark-blue-h"
                  } rounded-r-lg px-4 py-2`}
                  onClick={() => setOptions("user")}
                >
                  User List
                </button>
              </div>
            </div>

            <Paper>
              <TableContainer>
                <MUIDataTable
                  title={
                    options === "room"
                      ? "Room List"
                      : options === "usergroup"
                      ? "User Group List"
                      : "User List"
                  }
                  data={
                    options === "room"
                      ? RoomData
                      : options === "usergroup"
                      ? userGroupData
                      : userData
                  }
                  columns={
                    options === "room"
                      ? columnsRoom
                      : options === "usergroup"
                      ? columnsUserGroup
                      : columnsUser
                  }
                  options={{
                    rowsPerPage: 10,
                    selectableRows: "none",
                    elevation: 1,
                    tableBodyHeight: "80vh",
                    tableBodyMaxHeight: "80vh",
                    responsive: "standard" as "standard",
                    sortOrder: {
                      name: "id",
                      direction: "asc",
                    },
                  }}
                />
              </TableContainer>
            </Paper>
          </div>
        </div>
      </div>

      <Modal open={openUser}>
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
              Edit User
            </div>
            <div className="w-full px-24 py-4">
              <form
                onSubmit={UserForm.handleSubmit(onSubmitUser)}
                className="flex flex-col w-full gap-4"
              >
                <div>
                  <label className=" text-gray-700 font-bold">Name</label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="Room"
                    defaultValue={editUserData?.name}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...UserForm.register("name", { required: true })}
                  />
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">Email</label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="Email"
                    defaultValue={editUserData?.email}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...UserForm.register("email", { required: true })}
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
      <Modal open={openRoom}>
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
              Edit Room
            </div>
            <div className="w-full px-24 py-4">
              <form
                onSubmit={RoomForm.handleSubmit(onSubmitRoom)}
                className="flex flex-col w-full gap-4"
              >
                <div>
                  <label className=" text-gray-700 font-bold">Nama</label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="Judul"
                    defaultValue={editRoomData?.name}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...RoomForm.register("name", { required: true })}
                  />
                </div>
                <div>
                  <label className=" text-gray-700 font-bold">
                    Description
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    placeholder="Description"
                    defaultValue={editRoomData?.description}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    {...RoomForm.register("description", { required: true })}
                  />
                </div>
                <div>
                {editRoomData?.members.map((member: any, index: number) => (
                  <li key={index}>{member.name}</li>
                ))}
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
    </>
  );
}
