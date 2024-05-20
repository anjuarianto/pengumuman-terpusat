"use client"
import {Modal} from "@mui/material";
import React, {useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

type Props = {
    isOpen: boolean;
    isEdit: number | null;
    onClose: () => void;
};

type User = {
    id: number;
    name: string;
    email: string;
};



export default function ModalUser({isOpen, isEdit, onClose}: Props) {
    const API_URL = "api/user";
    const HEADERS = {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    };
    const UserForm = useForm<User>();
    const [editData, setEditData] = React.useState<User | null>(null);

    const loadUserDataById = async (value: number) => {
        try {
            const response = await axios.get(`${API_URL}/${value}`, {
                headers: HEADERS,
            });

            setEditData(response.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    const handleClose = () => {
        onClose();
        UserForm.reset();
        setEditData(null);
    };


    const onSubmit: SubmitHandler<User> = async (data) => {
        try {
            const url = isEdit ? `${API_URL}/${isEdit}` : API_URL;

            const method = isEdit ? "PUT" : "POST"


            const dataForm = {
                name: data.name,
                email: data.email,
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
                text: response.data.message,
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
        if(isEdit) {
            loadUserDataById(isEdit)
        }
    },[isOpen]);
    if (!isOpen) return null;
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
                        {!isEdit ? "Create User" : "Edit User"}
                    </div>
                    <div className="w-full px-4 md:px-24 py-4 overflow-y-auto">
                        <form
                            onSubmit={UserForm.handleSubmit(onSubmit)}
                            className="flex flex-col w-full gap-4"
                        >
                            <div>
                                <label className=" text-gray-700 font-bold">Name</label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    placeholder="Name"
                                    defaultValue={isEdit ? editData?.name : ""}
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
                                    readOnly={isEdit ? true : false}
                                    placeholder="Email"
                                    defaultValue={isEdit ? editData?.email : ""}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    {...UserForm.register("email", { require:true })}
                                />
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
                {/* </div> */}
            </div>
        </Modal>
    );
}