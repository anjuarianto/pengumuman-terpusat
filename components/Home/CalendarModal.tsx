import React from 'react';
import { Modal } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarModalProps = {
    openCal: boolean;
    handleClose: () => void;
};

const CalendarModal: React.FC<CalendarModalProps> = ({ openCal, handleClose }) => {
    return (
        <Modal open={openCal}>
            <div
                className="flex flex-col items-center justify-center h-screen"
                onClick={handleClose}
            >
                <div
                    className="flex flex-col items-center w-3/5 h-auto bg-white rounded-lg shadow-lg "
                    onClick={(e) => {
                        //Prevent event propagation only for this inner div
                        e.stopPropagation();
                    }}
                >
                    <div className="w-full h-full py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                        Calendar
                    </div>
                    <div className="w-full px-24 py-4">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            headerToolbar={{
                                left: "prev,today,next",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            eventTimeFormat={{
                                hour: "numeric",
                                minute: "2-digit",
                                meridiem: true,
                            }}
                            initialView="dayGridMonth"
                            events={[
                                {
                                    title: "event 1",
                                    start: "2024-03-11T10:00:00",
                                    end: "2024-03-11T11:00:00",
                                },
                                {
                                    title: "event 1.5",
                                    start: "2024-03-11T15:00:00",
                                    end: "2024-03-11T11:00:00",
                                },
                                {
                                    title: "event 2",
                                    start: "2024-03-21T10:00:00",
                                    end: "2024-03-23T11:00:00",
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CalendarModal;