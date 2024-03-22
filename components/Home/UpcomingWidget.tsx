import React, {useState} from 'react';
import { Modal } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type UpcomingWidgetProps = {
    events: {
        judul: string;
        waktu: string;
    }[];
};

const UpcomingWidget: React.FC<UpcomingWidgetProps> = ({events}) => {

    return (
        <div className="p-6 m-2 bg-white rounded-lg ">
            <h2 className="py-2 text-xl text-center ">Upcoming</h2>
            <div className="divide-y ">
                {events && events.map((event, index) => (
                    <div
                        key={index}
                        className="flex flex-col px-2 py-1 ">
                        <span className="font-bold">{event.judul}</span>{" "}
                        <span className="text-sm">{event.waktu}</span>
                    </div>
                ))}


            </div>
        </div>
    );
};

export default UpcomingWidget;