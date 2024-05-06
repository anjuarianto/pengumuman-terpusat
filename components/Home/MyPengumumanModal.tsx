'use client';
import axios from "axios";
import React, {useEffect} from "react";
import {Button, Modal, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Cookies from "js-cookie";

const API_URL = '/api/my-pengumuman/';
const HEADERS = {
    headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    }
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    date: string;
};

type DataItem = {
    id: number;
    title: string;
    waktu: string;
};

export default function MyPengumumanModal({isOpen, onClose, date}: ModalProps) {
    const [data, setData] = React.useState<DataItem[]>([]);

    const fetchData = async (date: string) => {
        const response = await axios.get(API_URL + date, HEADERS);

        const dataItem: DataItem[] = response.data.data?.map((item: any) => {
            return {
                id: item.id,
                title: item.judul,
                waktu: item.waktu
            }
        });

        setData(dataItem);
    }

    const handleButtonClick = (data: DataItem) => async () => {
        const url = `/home/${data.id}`;
        window.open(url, "_blank");
    }

    useEffect(() => {
        isOpen && fetchData(date);
    }, [isOpen]);

    return (
        <Modal open={isOpen}>
            <div
                className="flex flex-col items-center justify-center h-screen"
                onClick={onClose}
            >
                <div
                    className="flex flex-col items-center w-full md:w-4/5 h-4/5 md:max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div
                        className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                        Daftar Agenda
                    </div>
                    <div className="w-full px-4 md:px-24 py-4">
                        <Paper>
                            <Table className="borderless">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Waktu</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((item: DataItem, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.waktu}</TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={handleButtonClick(item)}
                                                    variant="contained"
                                                    color="primary">
                                                    Open
                                                </Button>
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