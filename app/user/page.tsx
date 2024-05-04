"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaAngleLeft } from "react-icons/fa";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ModalRoom from "@/components/Master/ModalRoom";
import ModalUser from "@/components/Master/ModalUser";
import ModalUserGroup from "@/components/Master/ModalUserGroup";

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

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

type Room = {
  id: number;
  name: string;
}

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

  const [isModalRoomOpen, setIsModalRoomOpen] = useState(false);
  const [isModalRoomEdit, setIsModalRoomEdit] = useState<number | null>(null);

  const [isModalUserGroupOpen, setIsModalUserGroupOpen] = useState(false);
  const [isModalUserGroupEdit, setIsModalUserGroupEdit] = useState<number | null>(null);

  const [isModalUserOpen, setIsModalUserOpen] = useState(false);
  const [isModalUserEdit, setIsModalUserEdit] = useState<number | null>(null);

  const [optionsMenu, setOptionsMenu] = useState<string>("usergroup");
  const [RoomData, setRoomData] = useState<Room[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [userGroupData, setUserGroupData] = useState<UserGroup[]>([]);
  const [myData, setMyData] = useState<any>();

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
      name: "user",
      label: "User",
      options: {
        customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
          return (
              <>
                <ul className="list-disc pl-4">
                  {value.map((member: any, index: number) => (
                      <li key={index}>{member.email}</li>
                  ))}
                </ul>
              </>
          );
        },
      },
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
                      onClick={() => {
                        setIsModalUserGroupOpen(true);
                        setIsModalUserGroupEdit(tableMeta.rowData[0]);
                      }}
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
      label: "Kategori Name",
    },
    {
      name: "description",
      label: "Description",
    },
    // {
    //   name: "members",
    //   label: "members",
    //   options: {
    //     customBodyRender: (value: any, tableMeta: MUIDataTableMeta) => {
    //       return (
    //         <>
    //
    //           <ul className="list-disc pl-4">
    //             {value?.map((member: any, index: number) => (
    //                 <li key={index}>{member.name}</li>
    //             ))}
    //           </ul>
    //         </>
    //       );
    //     },
    //   },
    // },

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
                        setIsModalRoomOpen(true);
                        setIsModalRoomEdit(tableMeta.rowData[0]);
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
    {
      name: "role",
      label: "Role"
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
                  <Tooltip title="Update User" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {
                        setIsModalUserOpen(true);
                        setIsModalUserEdit(tableMeta.rowData[0]);
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
    if(!isModalUserOpen) {
      loadUserData();
    }
  }, [isModalUserOpen])

  useEffect(() => {
    tokenCheck().then(() => {
      loadRoomData();
      loadMyData();
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

  const loadMyData = async () => {
    try {
      const response = await axios.get(
          "http://127.0.0.1:8000/api/me",
          {
            headers: {
              Authorization:
                  "Bearer " + Cookies.get("accessToken"),
            },
          }
      );
      setMyData(response.data);
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


  const handleClose = () => {
    setOpenUser(false);
    setIsModalRoomOpen(false);
    setIsModalRoomEdit(null);
  };

  const onSubmitUser: SubmitHandler<User> = async (data) => {
    const formatedData = {
      id: editUserData?.id,
      name: data.name,
      email: data.email,
      created_at: editUserData?.created_at,
      updated_at: editUserData?.updated_at,
    };
  };

  return (
    <>
      <Navbar role={myData?.role} email={myData?.email}></Navbar>
      <div className=" flex flex-col items-center w-full h-full pt-2 md:pt-16 ">
        <div className="flex flex-row justify-center w-full h-screen px-2 md:px-12">
          <div className="w-full h-screen ">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div className="flex flex-row gap-4 items-center my-2">
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
                          optionsMenu === "room"
                              ? "bg-dark-blue text-white"
                              : "bg-white hover:text-white hover:bg-dark-blue-h"
                      } rounded-l-lg px-4 py-2`}
                      onClick={() => setOptionsMenu("room")}
                  >
                    Kategori List
                  </button>
                  <button
                      className={`${
                          optionsMenu === "usergroup"
                              ? "bg-dark-blue text-white"
                              : "bg-white hover:text-white hover:bg-dark-blue-h"
                      } px-4 py-2`}
                      onClick={() => setOptionsMenu("usergroup")}
                  >
                    User Group List
                  </button>
                  <button
                      className={`${
                          optionsMenu === "user"
                              ? "bg-dark-blue text-white"
                              : "bg-white hover:text-white hover:bg-dark-blue-h"
                      } rounded-r-lg px-4 py-2`}
                      onClick={() => setOptionsMenu("user")}
                  >
                    User List
                  </button>
                </div>
              </div>
              <button
                  className="bg-dark-blue text-white rounded-lg px-4 py-2 "
                  onClick={() => {
                    switch (optionsMenu) {
                      case "room":
                        setIsModalRoomOpen(true)
                        break;
                      case "user":
                        setIsModalUserOpen(true);
                        break;
                      case "usergroup":
                        setIsModalUserGroupOpen(true);
                        break;
                    }
                  }}
              >
                {optionsMenu === "room" ? "Tambah Kategori" : optionsMenu === "user" ? "Tambah User" : "Tambah User Group"}
              </button>
            </div>

            <Paper>
              <TableContainer>
                <MUIDataTable
                  title={
                    optionsMenu === "room"
                      ? "Kategori List"
                      : optionsMenu === "usergroup"
                      ? "User Group List"
                      : "User List"
                  }
                  data={
                    optionsMenu === "room"
                      ? RoomData
                      : optionsMenu === "usergroup"
                      ? userGroupData
                      : userData
                  }
                  columns={
                    optionsMenu === "room"
                      ? columnsRoom
                      : optionsMenu === "usergroup"
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

      <ModalUser
        isOpen={isModalUserOpen}
        isEdit={isModalUserEdit}
        onClose={() => {
            setIsModalUserOpen(false);
            setIsModalUserEdit(null);
        }}
        />

      <ModalUserGroup
          isOpen={isModalUserGroupOpen}
          isEdit={isModalUserGroupEdit}
          onClose={() => {
            setIsModalUserGroupOpen(false);
            setIsModalUserGroupEdit(null);
          }}
      />

      <ModalRoom
        isModalOpen={isModalRoomOpen}
        isEdit={isModalRoomEdit}
        onClose={handleClose}
      />
    </>
  );
}
