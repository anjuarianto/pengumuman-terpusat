import React from 'react';
import {FaCalendarPlus, FaSearch} from "react-icons/fa";
import {useForm} from "react-hook-form";

type ToolbarProps = {
    openModalFormPengumuman: () => void;
    onSubmitSearch: (data: any) => void;
    handleInputChange: (event: any) => void;
    myData: any;
    roomActive: number;
    setRoomId: (id: number) => void;
    openFilterModal: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
                                             openModalFormPengumuman,
                                             onSubmitSearch,
                                             handleInputChange,
                                             myData,
                                             roomActive,
                                             setRoomId,
                                             openFilterModal
                                         }) => {
    const searchForm = useForm<any>();
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


                <form
                    className="relative w-full mx-auto text-gray-600 "
                    onSubmit={searchForm.handleSubmit(onSubmitSearch)}
                >
                    <input
                        className="h-10 px-5 pr-16 text-sm w-full bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
                        type="search"
                        placeholder="Search"
                        {...searchForm.register("search", {
                            onChange: handleInputChange,
                        })}
                    />
                    <button
                        type="submit"
                        className="absolute top-0 right-0 mt-3 mr-4"
                    >
                        <FaSearch/>
                    </button>
                </form>

                <button
                    onClick={openFilterModal}
                    className="px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 bg-orange">
                    Filter
                </button>

                <div
                    onClick={setRoomId}
                    className={`px-6 py-2 text-center rounded-lg shadow-lg basis-1/5 ${roomActive == 1 ? 'bg-amber-800' : 'bg-orange'}`}>
                    General
                </div>
            </div>
        </div>
    );
};

export default Toolbar;