import React from 'react';
import { Modal } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarModalProps = {
    openCal: boolean;
    handleClose: () => void;
    myCalendarData: any;
};

const CalendarModal: React.FC<CalendarModalProps> = ({ openCal, handleClose, myCalendarData}) => {
    return (
        <Modal open={openCal}>
            <div
                className="flex flex-col items-center justify-center h-screen"
                onClick={handleClose}
            >
                <div
                    className="flex flex-col items-center w-full md:w-3/5  h-3/5 md:h-auto bg-white rounded-lg shadow-lg "
                    onClick={(e) => {
                        //Prevent event propagation only for this inner div
                        e.stopPropagation();
                    }}
                >
                    <div className="w-full h-fit py-4 text-2xl font-bold text-center text-white rounded-t-lg bg-dark-blue ">
                        Calendar
                    </div>
                    <div className="w-full px-4 md:px-24 py-4">
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
                            events={myCalendarData}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CalendarModal;