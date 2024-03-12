"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableMeta,
} from "mui-datatables";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TableContainer, Paper, Tooltip } from "@mui/material";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function User() {
  const router = useRouter();

  const [RoomData, setRoomData] = useState<
    {
      id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [userData, setUserData] = useState<
    {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);

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
                  <Tooltip title="Update Role" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {}}
                    >
                      <FaEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Remove Role" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg "
                      onClick={() => {}}
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
      name: "email_verified_at",
      label: "Email verified at",
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
                  <Tooltip title="Update Role" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-lg "
                      onClick={() => {}}
                    >
                      <FaEdit />
                    </button>
                  </Tooltip>

                  <Tooltip title="Remove Role" placement="top" arrow>
                    <button
                      className="p-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-lg "
                      onClick={() => {}}
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
      loadUserData();
    });

    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
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

  return (
    <>
      <Navbar></Navbar>
      <div className=" flex flex-col items-center w-full h-full pt-16 ">
        <div className="flex flex-row justify-center w-full h-screen px-12">
          <div className="w-full h-screen ">
            <Paper>
              <TableContainer>
                <MUIDataTable
                  title={"Room List"}
                  data={RoomData}
                  columns={columnsRoom}
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
            <Paper>
              <TableContainer>
                <MUIDataTable
                  title={"User List"}
                  data={userData}
                  columns={columnsUser}
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
    </>
  );
}
