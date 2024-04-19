import React from 'react';
import {Button, Modal, Tooltip} from '@mui/material';
import {Controller} from "react-hook-form";
import Select from "react-select";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {FaAngleLeft, FaPlus} from "react-icons/fa";

type PengumumanDetailModalProps = {
    pengumuman: {
        judul: string;
        konten: string;
        waktu: string;
        rooms: { id: number; name: string };
    };
    isOpen: boolean;
    onRequestClose: () => void;
};

const PengumumanDetailModal: React.FC<PengumumanDetailModalProps> = ({ pengumuman, isOpen, onRequestClose }) => {

    return (
        <>
            <Modal open={isOpen}>
                <div
                    className="flex flex-col items-center justify-center h-screen"
                    onClick={onRequestClose}
                >
                    <div
                        className="flex flex-col items-center w-full md:w-4/5 h-3/5 bg-white rounded-lg shadow-lg "
                        onClick={(e) => {
                            //Prevent event propagation only for this inner div
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                            Detail Pengumuman
                        </div>
                        <div className="flex w-full p-4 flex-col gap-2 p-2 rounded-lg ">
                            <div className="flex flex-row items-center gap-2 text-sm justify-between">
                                <div className="flex flex-row gap-4 items-center ">
                                    <span>• {pengumuman.created_by}</span>{" "}
                                    <span className="text-main-3">{pengumuman.waktu} </span>
                                </div>

                                <span className="float-right bg-orange text-white rounded-2xl p-2">
                                  {pengumuman.room.name}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold">{pengumuman.judul}</h1>

                            <p
                                className="py-2"
                                dangerouslySetInnerHTML={{__html: pengumuman.konten}}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PengumumanDetailModal;