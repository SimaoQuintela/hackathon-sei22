import React, {useState} from 'react';
import './Static.css'

// variável staticc passada como parâmetro
/*variáveis de retorno: Static
                        activity
                        startHour
                        endHour
*/
export default function Static({staticc, slots, setSlots}){
    const [activity, setActivity] = useState('');
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    // das 08:00 às 21:00 - Perguntar se este intervalo de valores é o mais correto
    let hours = ["08:00","08:15","08:30","08:45","09:00","09:15","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
                 "14:00","14:30","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
    const daysAvaialable = [];
    const tickedBoxes = {
        "monday": false,
        "tuesday": false,
        "wednesday": false,
        "thursday": false,
        "friday": false,
        "saturday": false,
        "sunday": false
    }
    // ver isto logo pois não estou a meter corretamente os dados
    const clickHandler = (e) => {
        let x = e.target.value
        tickedBoxes[x] = !tickedBoxes[x]
    }

    function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

    const minutes = (string) => {
        const time = string.split(":");
        return parseInt(time[0])*60 + parseInt(time[1]);
    }



    const submitHandler = (e) => {
        console.log(tickedBoxes);
        for(const day in tickedBoxes){
            if(tickedBoxes[day]){
                const slots_temp = slots;
                const start = minutes(startHour);
                const end = minutes(endHour);
                slots_temp[0]["slots"][toTitleCase(day)][startHour] = activity;
                for (const slot in slots_temp[0]["slots"][toTitleCase(day)]) {
                    const min = minutes(slot);
                    console.log(slot);
                    if (min > start && min < end) {
                        delete slots_temp[0]["slots"][toTitleCase(day)][slot];
                    }
                }
                slots_temp[0]["slots"][toTitleCase(day)][endHour] = "Free";
                setSlots(slots_temp);
                console.log(slots_temp);
            }
        }

    }


    return (staticc !== '') ? (
        <div>
            <div>
                <input type="text" name="activity" id="activity-input-bar" value={activity} onChange={ (e) => setActivity(e.target.value)} placeholder='Activity'/>
            </div>
            <div>
                <select id='start-hour' name='start-hour'>
                    <option value='' onClick={(e) => setStartHour(e.target.value)} defaultValue>Start Hour</option>
                    {
                        hours.map((hour)=>{
                            return(
                                <option name='start-hour' value={hour} onClick={(e) => setStartHour(e.target.value)}>{hour}</option>
                            );
                        })
                    }
                </select>
            </div>
            <div>
                <select id="end-hour" name="end-hour">
                    <option value='' onClick={(e) => setEndHour(e.target.value)} defaultValue>End Hour</option>
                    {
                        hours.map((hour) => {
                            return(
                                <option name='end-hour' value={hour} onClick={(e) => setEndHour(e.target.value)}>{hour}</option>
                            );
                        })
                    }
                </select>
            </div>
            <div>
                <h3>Days avaialable</h3>
                <form>
                    {
                        days.map((day) =>{
                            return(
                                <div>
                                    <input className='checkbox' type='checkbox' id={day.toLowerCase()} name={day.toLowerCase()} value={day.toLowerCase()} onClick={clickHandler}/>
                                    <label htmlFor={day.toLowerCase()}>{day}</label><br />
                                </div>
                            );
                        })
                    }
                    {/*console.log(daysAvaialable)*/}
                </form>
            </div>
            <div>
                <button id='add-block' type='submit' onClick={submitHandler}>Add</button>
            </div>
        </div>
    ) : null
}