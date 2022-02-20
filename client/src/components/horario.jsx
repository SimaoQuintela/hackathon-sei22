import React from 'react';
import { schedule } from './schedule.js'

function transposeData(data) {
    let hours = Object.keys(Object.values(data)[0])
    let matrix = {}

    for (let i = 0; i < hours.length; i++) {
        let day = []
        for (let j = 0; j < 7; j++) {
            day.push(Object.values(Object.values(data)[j])[i])
        }
        matrix[hours[i]] = day
    }

    console.log(matrix);
    console.log(hours);

    const horario = {
        "horas": hours,
        "matrix": matrix
    }

    return horario
}

function HorarioRow({ matrix, hora }) {
    return (
        <tr className="">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ hora }</td>
            {
                matrix[hora].map(slot => {
                    return (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot}</td>
                    );
                })
            }
        </tr>
    );
}

export default function Horario() {
    const data = transposeData(schedule)

    return (
        <table className="min-w-full leading-normal divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Horas</th>
                    {
                        Object.keys(schedule).map(dia => {
                            return (
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >{ dia }</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {
                    data.horas.map(hora => {
                        return (
                            <HorarioRow matrix={data.matrix}  hora={hora}/>
                        );
                    })
                }
            </tbody>
        </table>
    );
}