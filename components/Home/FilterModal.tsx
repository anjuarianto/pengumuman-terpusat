'use client';
import {Box, FormControl, Grid, Modal, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import Select from 'react-select';
import axios from "axios";
import Cookies from "js-cookie";

const HEADERS = {
    headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    }
};

const PENGIRIM_SOURCE_URL = 'http://localhost:8000/api/user?role=dosen';
const PENERIMA_SOURCE_URL = 'http://localhost:8000/api/user';


type FilterModalProps = {
    isOpen: boolean;
    filterValue: () => void;
    onClose: () => void;
};

export default function FilterModal({isOpen, onClose, filterValue}: FilterModalProps) {

    const [pengirimOptions, setPengirimOptions] = useState<any[]>([]);
    const [penerimaOptions, setPenerimaOptions] = useState<any[]>([]);

    const [selectedOrder, setSelectedOrder] = useState<any>(
        {value: 'desc', label: 'Terbaru'}
    );
    const [selectedPengirim, setSelectedPengirim] = useState<any>(null);
    const [selectedPenerima, setSelectedPenerima] = useState<any>(null);
    const [minDate, setMinDate] = useState<string>('');
    const [maxDate, setMaxDate] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');

    const orderOptions = [
        {value: 'desc', label: 'Terbaru'},
        {value: 'asc', label: 'Terlama'},
    ];

    const getPengirim = async () => {
        const response = await axios.get(PENGIRIM_SOURCE_URL, HEADERS);

        const data = response.data.data.map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            }
        });

        data.unshift({value: '', label: 'Semua Pengirim'});

        setPengirimOptions(data);
    }

    const getPenerima = async () => {
        const response = await axios.get(PENERIMA_SOURCE_URL, HEADERS);

        const data = response.data.data.map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            }
        });


        setPenerimaOptions(data);
    }

    const handleApplyFilter = () => {
        const arrayPenerima = selectedPenerima?.map((item: any) => {
            return item?.value
        });
        const filter = {
            order: selectedOrder?.value,
            min_date: minDate?.trim(),
            max_date: maxDate?.trim(),
            pengirim: selectedPengirim?.value,
            penerima_id: arrayPenerima,
            file_name: fileName?.trim(),
        }

        filterValue(filter)

        onClose()
    }

    useEffect(() => {
        if (isOpen) {
            getPenerima();
            getPengirim();
        }

    }, [isOpen]);


    return (
        <>
            <Modal open={isOpen}>
                <div
                    className="flex flex-col items-center justify-center h-screen"
                    onClick={onClose}
                >
                    <div
                        className="flex flex-col items-center w-full md:w-3/5  h-3/5 md:h-auto bg-white rounded-lg shadow-lg "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                            Filter Pencarian
                        </div>
                        <div className="w-full p-4">
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <label>Urutkan berdasarkan:</label>
                                            <Select
                                                menuPortalTarget={document.body}
                                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                placeholder="Urutkan Berdasarkan..."
                                                options={orderOptions}
                                                classNamePrefix="select"
                                                defaultValue={selectedOrder}
                                                onChange={(value) => {
                                                    setSelectedOrder(value)
                                                }}
                                                value={selectedOrder}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <label>Min Date</label>
                                                <input
                                                    type="date"
                                                    name="min_date"
                                                    value={minDate}
                                                    required
                                                    className="p-1.5 border border-gray-300 rounded-md w-full"
                                                    onChange={(e) => {
                                                        setMinDate(e.target.value)
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label>Max Date</label>
                                                <input
                                                    type="date"
                                                    name="max_date"
                                                    value={maxDate}
                                                    required
                                                    className="p-1.5 border border-gray-300 rounded-md w-full"
                                                    onChange={(e) => {
                                                        setMaxDate(e.target.value)
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            placeholder="--Pilih Pengirim--"
                                            options={pengirimOptions}
                                            isSearchable
                                            className="basic-select"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                                setSelectedPengirim(value)
                                            }}
                                            value={selectedPengirim}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            placeholder="--Semua Penerima--"
                                            isSearchable
                                            options={penerimaOptions}
                                            isMulti
                                            className="basic-select"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                                setSelectedPenerima(value)
                                            }}
                                            value={selectedPenerima}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth size="small">
                                            <TextField
                                                variant="outlined"
                                                size={"small"}
                                                label="Nama Attachment"
                                                onChange={(e) => setFileName(e.target.value)}
                                                value={fileName}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <button
                                            type="button"
                                            onClick={handleApplyFilter}
                                            className="px-24 py-2 mt-4 text-white bg-blue-500 rounded-lg w-fit hover:bg-blue-600"
                                        >
                                            Apply
                                        </button>
                                    </Grid>
                                </Grid>


                            </Box>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );

}