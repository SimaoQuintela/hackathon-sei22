import React from 'react';

function H2M(timeInHour){
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

function convertData(data, dias) {
    const starts = dias.map(dia => {
        return Object.keys(data[dia])
    })

    const labels = dias.map(dia => {
        return Object.values(data[dia])
    })

    const horas = dias.map((_, index) => {
        return [...starts[index], "24:00"].map(H2M)
    })

    const duration = horas.map(dia => {
        let buff = []
        for (let i = 0; i < dia.length-1; i++) {
            buff.push((dia[i+1] - dia[i]) / 15)
        }
        return buff
    })

    const entries = labels.map((dia, i) => {
        return dia.map((slot, j) => {
            return [slot, duration[i][j], starts[i][j]]
        })
    }).flat()

    console.log(entries);

    return entries
}

function Block({label, duration, start}) {
    return (
        <div
            className="bg-blue-50 text-blue-700 rounded-md text-center text-sm flex flex-col items-center justify-center py-2"
            style={{
                gridRow: `span ${duration} / span ${duration}`
            }}
        >
            {start}
            <span className="font-semibold">{label}</span>
        </div>
    )
}

function FreeBlock({duration}) {
    return (
        <div
            className="bg-gray-100 rounded-md"
            style={{
                gridRow: `span ${duration} / span ${duration}`
            }}
        ></div>
    )
}

export default function ScheduleGrid({slots}) {
    // 8 colunas (dias+hora); 60 linhas (slots)
    const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const horas = ["Hours", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    const entries = convertData(slots[0].slots, dias)

    let ptr = -1

    return (
        <div
            className="grid grid-flow-col gap-2"
            style={{
                gridTemplateRows: "repeat(68, minmax(0, 1fr))"
            }}
        >
            {
                horas.map((hora, index) => {
                    return <Block label={hora} duration={4} start={""} key={index}/>
                })
            }
            {
                entries.map(([label, duration, start], index) => {
                    return (
                        <>
                        {
                            start === "08:00"
                            ? <Block label={dias[++ptr]} duration={4} start={""} key={index+100}/>
                            : <></>
                        }
                        {
                            label === "Free"
                            ? <FreeBlock duration={duration} key={index+500}/>
                            : <Block label={label} duration={duration} start={start} key={index+500}/>
                        }
                        </>
                    );
                })
            }
        </div>
    );
}