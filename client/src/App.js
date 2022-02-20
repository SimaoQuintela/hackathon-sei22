import * as React from "react";
import { useState } from "react";
import ScheduleGrid from "./components/ScheduleGrid";
import "./App.css";
import { Landing } from "./components/Landing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import PopUp from "./components/PopUp";

const slots_imported = [
    {
        slots: {
            Monday: {
                "08:00": "Free",
            },
            Tuesday: {
                "08:00": "Free",
            },
            Wednesday: {
                "08:00": "Free",
            },
            Thursday: {
                "08:00": "Free",
            },
            Friday: {
                "08:00": "Free",
            },
            Saturday: {
                "08:00": "Free",
            },
            Sunday: {
                "08:00": "Free",
            },
        },
    },
];

export default function App() {
    const [buttonPopup, setButtonPopup] = useState();
    const [slots, setSlots] = useState(slots_imported);
    const [data, setData] = useState({});

    function sendHandler() {
        fetch("http://localhost:8000", {
            method: "POST",
            body: `{"schedule" : ${JSON.stringify(
                slots
            )}, "dynamic_slots": ${JSON.stringify(data)}}`,
            headers: { "Content-type": "application/json" },
        }).then(function (data) {
            setSlots(data);
            console.log(data);
        });
    }

    return (
        <main>
            <Landing />
            <div className="py-24">
                <FontAwesomeIcon
                    icon={faArrowDown}
                    className="animate-bounce w-10 h-10"
                />
            </div>
            <div>
                <section className="container mx-auto shadow-lg p-8 rounded-2xl">
                    <div id="button-container">
                        <div>
                            <h1 className="">Schedule</h1>
                            <button onClick={() => setButtonPopup(true)}>
                                Add new
                            </button>
                            <button onClick={sendHandler}>Send</button>
                        </div>
                        <PopUp
                            trigger={buttonPopup}
                            setTrigger={setButtonPopup}
                            slots={slots}
                            setSlots={setSlots}
                            setData={setData}
                            data={data}
                        />
                    </div>

                    <ScheduleGrid slots={slots} />
                    {/*<Horario />*/}
                </section>
            </div>
        </main>
    );
}
