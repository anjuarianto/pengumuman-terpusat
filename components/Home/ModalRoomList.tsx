import {Modal, Paper, Table, TableHead, TableBody, TableRow, TableCell, Button} from "@mui/material";
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";

const API_URL = '/api/room-member';
const HEADERS = {
    headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    }
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

interface DataItem {
    id: number;
    name: string;
    is_joined: boolean;
}

export default function ModalRoomList({isOpen, onClose}: ModalProps) {

    const [data, setData] = useState<DataItem[]>([]);
    const [reload, setReload] = useState(false);
    const handleButtonClick = async (data: DataItem) => {
        try {
            let url = data.is_joined ? `${API_URL}/unjoin` : `${API_URL}/join`;
            const response = await axios.post(url, { room_id : data.id }, HEADERS);
            setReload(true);
        } catch (error) {
            console.log(error)
        }
    }
    const fetchData = async () => {
        try {
            const response = await axios.get<DataItem[]>(API_URL, HEADERS);
            setData(response.data.data)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchData();
        setReload(false)
    }, [reload]); // Add any dependencies here

    if (!isOpen) return null;
    return (
        <Modal open={isOpen}>
            <div
                className="flex flex-col items-center justify-center h-screen"
                onClick={onClose}
            >
                <div
                    className="flex flex-col items-center w-full md:w-3/5 h-3/5 md:max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                        Daftar Semua Room
                    </div>
                    <div className="w-full px-4 md:px-24 py-4">
                        <Paper>
                            <Table className="borderless">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((item: DataItem, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index++}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color={item.is_joined ? 'error' : 'primary'}
                                                    onClick={() => handleButtonClick(item)}
                                                >
                                                    {item.is_joined ? 'Unjoin' : 'Join'}</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </div>
            </div>
        </Modal>
    )
}