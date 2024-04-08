import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React from "react";
import "@/app/calendar.css";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = 'http://127.0.0.1:8000/api/my-pengumuman/';
const HEADERS = {
    headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
    }
};

type CalendarProps = {
    myCalendarData: any;
};


export default function Calendar({myCalendarData}: CalendarProps) {
    const eventDates = myCalendarData ? myCalendarData.map((event: any) => {
        let date = new Date(event.start);
        date.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        console.log(date.toISOString().split('T')[0])
        return date.toISOString().split('T')[0];
    }) : [];

    const handleDateClick = async (arg: any) => {
        const response = await axios.get(API_URL + arg.dateStr, HEADERS);

        if(response.data.data !== null) {
            alert('data ada')
        }
    };

    return (
        <>
                <div id="myCalendar" className="bg-white m-2 p-2 gap-4 rounded-lg">
                    <FullCalendar
                        timeZone="Asia/Jakarta"
                        height="400px"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        eventTimeFormat={{
                            hour: "numeric",
                            minute: "2-digit",
                            meridiem: true,
                        }}
                        initialView="dayGridMonth"
                        events={myCalendarData}
                        dateClick={handleDateClick}
                        dayCellClassNames={(args) => {
                            args.date.toLocaleString('id-ID', {timeZone: 'Asia/Jakarta'})
                            let date = args.date.toISOString().split('T')[0];
                            console.log(eventDates)
                            if (eventDates.includes(date)) {
                                return ["bg-green-200"];
                            } else {
                                return [];
                            }
                        }}
                    />
                </div>



        </>
    )
}
