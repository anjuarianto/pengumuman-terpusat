import React, {useState} from 'react';
import CardAnnouncement from "@/components/CardAnnouncement";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import PengumumanDetailModal from "@/components/Home/PengumumanDetailModal";

type Pengumuman = {
    created_by: string;
    id: number;
    judul: string;
    konten: string;
    waktu: string;
    penerima: { penerima_id: number; name: string; is_single_user: boolean }[];
    files:{file:string; original_name:string}[];
    can_reply: boolean;
    can_edit: boolean;
    can_delete: boolean;
};

type PengumumanListProps = {
    pengumuman: Pengumuman[];
    editForm: (id: number) => void;
    reload: () => void;
};

const PengumumanList: React.FC<PengumumanListProps> = ({pengumuman, editForm, reload}) => {

    const [selectedPengumuman, setSelectedPengumuman] = useState<{
        judul: string;
        konten: string;
        waktu: string;
        rooms: { id: number; name: string };
        files:{file:string; original_name:string}[];
    }[] | null>(null);
    const handleCardClick = (data) => {
        setSelectedPengumuman(data)
    };

    const deletePengumuman = async (id) => {
        Swal.fire({
            title: `Delete Pengumuman ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const apiUrl = `http://127.0.0.1:8000/api/pengumuman/${id}`;
                await axios
                    .delete(apiUrl, {
                        headers: {
                            Authorization:
                                "Bearer " + Cookies.get("accessToken"),
                        },
                    })
                    .then(async (response) => {
                        await Swal.fire("Deleted!", response.data.message, "success");
                    })
                    .then(async () => {
                        reload()
                    })
                    .catch((error) => {
                        Swal.fire("Gagal", error, "error");
                    });
            }
        });
    };
    if (pengumuman.length === 0) {
        return (
            <div className="w-full md:w-3/5 md:h-screen  order-last md:order-none">
                <div className="flex flex-col gap-4 m-2 rounded-lg ">
                    <h1 className="text-2xl font-bold text-center">No Pengumuman</h1>

                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-3/5 md:h-screen  order-last md:order-none">
            <div className="flex flex-col gap-4 m-2 rounded-lg ">
                {pengumuman.length == 0 ? (
                    <h1 className="text-2xl font-bold text-center">No Pengumuman</h1>
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
                            files={data.files}
                            created_by={data.created_by}
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
        </div>
    );
};

export default PengumumanList;