import React from 'react';
import {FaCalendarPlus, FaSearch} from "react-icons/fa";
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
        <div className="w-full md:w-3/5 py-2 px-2 md:px-10 ">
            <div className="flex flex-row items-center gap-4 text-white">

                {canCreate && (
                    <button
                        className="flex flex-row items-center gap-2 px-6 py-2 transition-all  rounded-lg shadow-md basis-1/5 bg-orange hover:bg-orange-h hover:shadow-lg hover:cursor-pointer"
                        onClick={openModalFormPengumuman}
                    >
                        <FaCalendarPlus/>
                        <span>Add News </span>
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
                    className="px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 bg-orange">
                    Filter
                </button>

                {/*<div*/}
                {/*    onClick={setRoomId}*/}
                {/*    className={`px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 ${roomActive == 1 ? 'bg-amber-800' : 'bg-orange'}`}>*/}
                {/*    General*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Toolbar;