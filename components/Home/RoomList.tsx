import {FaPlus} from "react-icons/fa";
import React, {useEffect, useState} from "react";

import axios from "axios";
import Cookies from "js-cookie";

type RoomListProps = {
    openModal: () => void;
    isModalOpen: boolean;
    setRoomId: (id: string) => void;
    roomActive: number;
};
export default function RoomList({openModal, isModalOpen, setRoomId, roomActive}: RoomListProps) {

        const [roomList, setRoomList] = useState<{label: string, value: string}[]>([]);

        const loadRoomData = async () => {
            try {
                const response = await axios.get(
                    "/api/me",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + Cookies.get("accessToken"),
                        },
                    }
                );

                // Map the data into the desired structure
                const mappedData = response.data.rooms.map((room: any) => ({
                    value: room.id,
                    label: room.name,
                }));
                // Set the mapped data into state
                setRoomList(mappedData);
            } catch (err) {
                console.log(err);
            }
        };

    useEffect(() => {
        if(!isModalOpen) {
            loadRoomData();
        }
    }, [openModal]);

    return (
            <div className="w-full  h-fit md:w-1/5 md:h-screen">
                <div className="md:p-6 p-2 m-2 bg-white rounded-lg">
                    <div className="flex flex-row ">
                        <h2 className="text-left grow ">Room List</h2>{" "}
                        <FaPlus className="p-1 text-2xl hover:cursor-pointer" onClick={openModal}></FaPlus>
                    </div>

                    {roomList.map((data, index) => (
                        <div
                            key={index}
                            className={`px-2 py-1 my-2 text-center text-white rounded-lg shadow-lg ${roomActive == parseInt(data.value) ? 'bg-amber-800' : 'bg-orange'} hover:bg-amber-800`}
                            onClick={() => setRoomId(data.value)}
                        >
                            {data.label}
                        </div>
                    ))}
                </div>
            </div>
        );

}
