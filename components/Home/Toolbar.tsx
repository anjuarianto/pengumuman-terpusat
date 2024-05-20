import React from 'react';
import {FaCalendarPlus, FaFilter} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {TextField} from "@mui/material";

type ToolbarProps = {
    openModalFormPengumuman: () => void,
    myData: any,
    roomActive: number,
    setRoomId: (id: number) => void,
    openFilterModal: () => void,
    handleSearchChange?: (event: any) => void
}

const Toolbar: React.FC<ToolbarProps> = ({
                                             openModalFormPengumuman,
                                             myData,
                                             openFilterModal,
                                             handleSearchChange
                                         }) => {
    const canCreate = myData?.permissions.includes("create-pengumuman");

    return (
        <div className="w-full md:5/5 py-2 px-2 md:px-10 ">
            <div className="flex flex-row items-center gap-4 text-white">

                {canCreate && (
                    <button
                        className="flex flex-row justify-center items-center gap-2 px-6 py-2 transition-all  rounded-lg shadow-md basis-1/5 bg-dark-blue hover:bg-dark-blue-500 hover:shadow-lg hover:cursor-pointer"
                        onClick={openModalFormPengumuman}
                    >
                        <FaCalendarPlus/>
                        <span>Pengumuman Baru</span>
                    </button>
                )}


                <TextField
                    sx={{width: "100%", background: 'white', borderRadius: '5px'}}
                    variant="outlined"
                    size={"small"}
                    placeholder="Search..."
                    onChange={handleSearchChange}
                />
                <button
                    onClick={openFilterModal}
                    className="flex flex-row justify-center items-center gap-2 px-6 py-2 transition-all  rounded-lg shadow-md basis-1/5 bg-dark-blue hover:bg-dark-blue-500 hover:shadow-lg hover:cursor-pointer">
                    <FaFilter/>
                    <span>Filter</span>
                </button>
            </div>
        </div>
    );
};

export default Toolbar;