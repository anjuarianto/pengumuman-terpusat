"use client"
import React, {useEffect, useState} from 'react';
import CardAnnouncement from "@/components/CardAnnouncement";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import PengumumanDetailModal from "@/components/Home/PengumumanDetailModal";
import Pagination from "@/components/Home/Pagination";

type Pengumuman = {
    created_by: string;
    id: number;
    judul: string;
    konten: string;
    room: { id: number; name: string };
    waktu: string;
    penerima: { penerima_id: number; name: string; is_single_user: boolean }[];
    is_private: number;
    files:{file:string; original_name:string}[];
    can_reply: boolean;
    can_edit: boolean;
    can_delete: boolean;
    created_at: string;
};

type PengumumanListProps = {
    editForm: (id: number) => void;
    filter: {
        order: null;
        min_date: null;
        max_date: null;
        jenis: null;
        kategori: null;
        pengirim: null;
        penerima_id: null;
        file_name: null;
    };
    search: string;
    load: boolean;
};

const PengumumanList: React.FC<PengumumanListProps> = ({editForm, search, filter, load}) => {
    const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
    const [selectedPengumuman, setSelectedPengumuman] = useState<{
        judul: string;
        konten: string;
        waktu: string;
        created_by: string;
        room: { id: number; name: string };
        files:{file:string; original_name:string}[];
    } | null>(null);
    const [reload, setReload] = useState(false);
    const handleCardClick = (data:any) => {
        setSelectedPengumuman(data)
    };
    const [meta, setMeta] = useState<{ currentPage: number; lastPage: number }>({
        currentPage: 1,
        lastPage: 1,
    });

    const loadPengumumanData = async (page: any) => {
        try {
            const API_URL_PENGUMUMAN = "/api/pengumuman";
            const API_URL_PENGUMUMAN_PUBLIK = "/api/pengumuman-publik";

            // if authenticated url is /api/pengumuman, else /api/pengumuman-publik
const url = Cookies.get("accessToken") ? API_URL_PENGUMUMAN : API_URL_PENGUMUMAN_PUBLIK;

            const response = await axios.get(url, {
                params: {
                    search: search,
                    page: page,
                    order: filter?.order,
                    min_date: filter?.min_date,
                    max_date: filter?.max_date,
                    room_id: filter?.kategori,
                    pengirim: filter?.pengirim,
                    is_private: filter?.jenis,
                    penerima_id: filter?.penerima_id,
                    file_name: filter?.file_name,
                },
                headers: {
                    Authorization: "Bearer " + Cookies.get("accessToken"),
                },
            });

            const pengumumanData: Pengumuman[] = response.data.data.data;

            setMeta({
                currentPage: response.data.data.meta.current_page,
                lastPage: response.data.data.meta.last_page
            });

            setPengumuman(pengumumanData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadPengumumanData(1);
    },[]);

    useEffect(() => {
        if(reload) {
            loadPengumumanData(meta.currentPage);
            setReload(false)
        }
    }, [reload]);

    useEffect(() => {
            loadPengumumanData(1);
    }, [search, filter, load]);

    const deletePengumuman = async (id:number) => {
        Swal.fire({
            title: `Yakin Akan Hapus Pengumuman ini ?`,
            text: "Kamu Tidak Bisa Mengembalikan Ini",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "YA, Hapus",
            cancelButtonText: "Tidak"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const apiUrl = `/api/pengumuman/${id}`;
                await axios
                    .delete(apiUrl, {
                        headers: {
                            Authorization:
                                "Bearer " + Cookies.get("accessToken"),
                        },
                    })
                    .then(async (response) => {
                        await Swal.fire("Terhapus!", response.data.message, "Berhasil");
                    })
                    .then(async () => {
                        setReload(true)
                    })
                    .catch((error) => {
                        Swal.fire("Gagal", error, "error");
                    });
            }
        });
    };

    return (
        <div className="w-full md:w-5/5 md:h-screen  order-last md:order-none">
            <Pagination
                meta={meta}
                setMeta={setMeta}
                reload={() => { setReload(true) }}
            />
            <div className="flex flex-col gap-4 m-2 rounded-lg ">
                {pengumuman.length == 0 ? (
                    <div className="min-h-52 flex justify-center">
                        <h1 className="text-2xl mt-auto mb-auto font-bold text-center">No Pengumuman</h1>
                    </div>

                ) : (pengumuman.map((data, index) => (
                        <CardAnnouncement
                            openDetailModal={() => handleCardClick(data)}
                            key={index}
                            id={data.id}
                            room={data.room}
                            title={data.judul}
                            date={data.waktu}
                            time={data.waktu}
                            room_id={data.id}
                            content={data.konten}
                            penerima={data.penerima}
                            is_private={data.is_private}
                            files={data.files}
                            created_by={data.created_by}
                            created_at={data.created_at}
                            editForm={() => editForm(data.id)}
                            can_reply={data.can_reply}
                            can_edit={data.can_edit}
                            deletePengumuman={() => deletePengumuman(data.id)}
                            can_delete={data.can_delete}
                        />
                    )
                ))}
                {selectedPengumuman && (
                    <PengumumanDetailModal
                        pengumuman={selectedPengumuman}
                        isOpen={!!selectedPengumuman}
                        onRequestClose={() => setSelectedPengumuman(null)}
                    />
                )}
            </div>

            <Pagination
                meta={meta}
                setMeta={setMeta}
                reload={() => { setReload(true) }}
            />
        </div>
    );
};

export default PengumumanList;