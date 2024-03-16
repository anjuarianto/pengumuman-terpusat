import React from 'react';
import { Modal } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type UpcomingWidgetProps = {

};

const UpcomingWidget: React.FC<UpcomingWidgetProps> = () => {
    return (
        <div className="p-6 m-2 bg-white rounded-lg ">
            <h2 className="py-2 text-xl text-center ">Upcoming</h2>
            <div className="divide-y ">
                <div className="flex flex-col px-2 py-1 ">
                    <span className="font-bold">Judul 1</span>{" "}
                    <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 ">
                    <span className="font-bold">Judul 1</span>{" "}
                    <span className="text-sm">15 January 2024</span>
                </div>
                <div className="flex flex-col px-2 py-1 ">
                    <span className="font-bold">Judul 1</span>{" "}
                    <span className="text-sm">15 January 2024</span>
                </div>
            </div>
        </div>
    );
};

export default UpcomingWidget;