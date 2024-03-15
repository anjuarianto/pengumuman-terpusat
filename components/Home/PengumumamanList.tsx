import React from 'react';
import { NextPage } from 'next';
import CardAnnouncement from "@/components/CardAnnouncement";

type Pengumuman = {
    created_by: string;
    id: number;
    judul: string;
    konten: string;
    waktu: string;
    can_reply: boolean;
};

type PengumumanListProps = {
    pengumuman: Pengumuman[];
    editForm: (id: number) => void;
};

export const PengumumanList: NextPage<PengumumanListProps> = ({ pengumuman, editForm }) => {
    return (
        <div className="w-3/5 h-screen ">
            <div className="flex flex-col gap-4 m-2 rounded-lg ">
                {pengumuman.map((data, index) => (
                    <CardAnnouncement
                        key={index}
                        id={data.id}
                        room={{ value: data.created_by, label: data.created_by }}
                        title={data.judul}
                        date={data.waktu}
                        time={data.waktu}
                        room_id={data.id}
                        content={data.konten}
                        canReply={data.can_reply}
                        editForm={() => editForm(data.id)}
                    />
                ))}
            </div>
        </div>
    );
};