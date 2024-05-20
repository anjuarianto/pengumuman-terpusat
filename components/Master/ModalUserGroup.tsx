"use client"
import {Modal} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Select from "react-select";

type Props = {
    isOpen: boolean;
    isEdit: number | null;
    onClose: () => void;
};

type UserGroup = {
    id: number;
    name: string;
    user: {
        id: number;
        name: string;
        email: string;
    }
};

type User = {
    id: number;
    name: string;
    email: string;
}

export default function ModalUserGroup({isOpen, isEdit, onClose}: Props) {
    const API_URL = "api/user-group";
    const HEADERS = {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    };

    const [editData, setEditData] = React.useState<UserGroup | null>(null);
    const [editName, setEditName] = useState<any>(null);
    const [userSelected, setUserSelected] = useState<any>(null);
    const [userOptions, setUserOptions] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);
    const UserGroupForm = useForm<UserGroup>();

    const loadAllUser = async () => {
        try {
            const response = await axios.get(`/api/user`, {
                headers: HEADERS,
            });

            const users = response.data.data.map((user: any) => ({
                label: user.name,
                value: user.id,
            }));

            setUserOptions(users);
        } catch (error) {
            console.log(error);
        }
    };

    const loadUserGroupDataById = async (value: number) => {
        try {
            const response = await axios.get(`${API_URL}/${value}`, {
                headers: HEADERS,
            });

            const usersSelected = response.data.data.user.map((user: any) => ({
                label: user.name,
                value: user.id
            }));

            const data: UserGroup = {
                id: response.data.data.id,
                name: response.data.data.name,
                user: response.data.data.user.map((user:User) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }))
            }

            setUserSelected(usersSelected);
            setEditName(response.data.data.name);


        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        onClose();
        UserGroupForm.reset();
        setUserSelected(null);
        setEditName(null);
    };


    const onSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const url = isEdit ? `${API_URL}/${isEdit}` : API_URL;

            const method = isEdit ? "PUT" : "POST"
            const user = userSelected.map((member: any) => member.value);
            const dataForm = {
                name: editName,
                user: user,
                _method: method
            }

            const response = await axios({
                method,
                url: url,
                data: dataForm,
                headers: HEADERS
            });


            response.data.status === 'success' && handleClose();

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                customClass: {
                    container: "my-swal-popup ",
                },
                text: response.data?.message,
            });
        } catch(err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal",
                customClass: {
                    container: "my-swal-popup ",
                },
                text: err.response.data?.message,
            });
        }
    }

    useEffect(() => {
        if (isOpen && isEdit) {
            loadAllUser();
            loadUserGroupDataById(isEdit);
        }

        if (isOpen && !isEdit) {
            loadAllUser();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Modal open={isOpen}>
            <div
                className="flex flex-col items-center justify-center h-screen"
                onClick={handleClose}
            >
                <div
                    className="flex flex-col items-center w-full md:w-2/5 h-3/5 bg-white rounded-lg shadow-lg "
                    onClick={(e) => {
                        //Prevent event propagation only for this inner div
                        e.stopPropagation();
                    }}
                >
                    <div className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                        {!isEdit ? "Buat Kelompok Pengguna" : "Edit Kelompok Pengguna"}
                    </div>
                    <div className="w-full px-4 md:px-24 py-4 overflow-y-auto">
                        <form
                            onSubmit={onSubmit}
                            className="flex flex-col w-full gap-4"
                        >
                            <div>
                                <label className=" text-gray-700 font-bold">Nama</label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    placeholder="Judul"
                                    defaultValue={isEdit ? editName : ""}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    onChange={(event) => {setEditName(event.target.value)}}
                                />
                            </div>
                            <div>
                                <div>
                                    <label className=" text-gray-700 font-bold">Members</label>

                                        <Select
                                            // menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, height: 35,
                                                    minHeight: 35, zIndex: 9999})}}
                                            value={userSelected}
                                            placeholder="User :..."
                                            isMulti
                                            isSearchable
                                            options={userOptions}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                                setUserSelected(value);
                                            }}
                                        />

                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <button
                                    type="submit"
                                    className="px-24 py-2 mt-4 text-white bg-blue-500 rounded-lg w-fit hover:bg-blue-600"
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}