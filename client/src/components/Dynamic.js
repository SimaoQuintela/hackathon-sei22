import { editableInputTypes } from '@testing-library/user-event/dist/utils';
import React, {useState} from 'react';
import './Dynamic.css'

export default function Dynamic({dynamic, setData, data}){
    const [activity, setActivity] = useState('');
    const [catchDayTime, setCatchDayTime] = useState('')
    const [daysAvaialable, setDaysAvaialable] = useState('')
    const [numberHours, setNumberHours] = useState('');
    const [particionableHour, setParticionableHour] = useState('');
    const hours = ["00:15", "00:30", "00:45", "01:00", "02:00", "03:00","04:00","05:00","06:00", "07:00", "08:00",
                   "09:00", "10:00","11:00","12:00","13:00","14:00"];
    const particionableHours = ["00:15", "00:30", "00:45", "01:00", "02:00", "03:00"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const time = ["00:15","00:30","00:45", "01:00", "02:00"];
    const dayTime = {"Morning":false,
                     "Afternoon":false,
                     "Night":false,
                     "Late_Night":false
                };
    const tickedBoxes = {
        "monday": false,
        "tuesday": false,
        "wednesday": false,
        "thursday": false,
        "friday": false,
        "saturday": false,
        "sunday": false
    }
    const [isFixed, setIsFixed] = useState(false)

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

    const submitHandler = (e) => {
        let data_temp = data;
        data_temp[activity] = {}
        data_temp[activity]["hours"] = numberHours
        for(let i in tickedBoxes){
            data_temp[activity][i] = tickedBoxes[i] 
        } 
        data_temp[activity]["days"] = {};
        for (let day in tickedBoxes) {
            data_temp[activity]["days"][toTitleCase(day)] = tickedBoxes[day];
        }
        data_temp[activity]['time'] = particionableHour
        data_temp[activity]['is_fixed'] = isFixed
    }

    if(dynamic !== ''){
        return(
            <div>
                <div>
                    <input type="text" name="activity" id="activity-input-bar" value={activity} onChange={ (e) => setActivity(e.target.value)} placeholder='Activity'/>
                </div>
                <div>
                    <select id="end-hour" name="end-hour">
                    <option value='' onClick={(e) => setNumberHours(e.target.value)} defaultValue>Number of hours</option>
                    {
                        hours.map((hour) => {
                            return(
                                <option name='end-hour' value={hour} onClick={(e) => setNumberHours(e.target.value)}>{hour}</option>
                            );
                        })
                    }
                    </select>
                </div>
                <div id='dayTime'>
                    {
                        (Object.keys(dayTime)).map((day)=>{
                            return(
                                <div className="daytime-container">
                                    <input type='checkbox'  id={day.toLowerCase()} name={day.toLowerCase()} value={day.toLowerCase()} onClick={clickHandler} />
                                    
                                    <label className="daytime-text" for={day.toLowerCase()}>{day}</label>
                                </div>
                            );
                        })                        
                    }
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
                    </form>
                </div>
                <div>
                    <p>Is it fixed?</p>
                    <form className='particionable'>
                        <input type="radio" id='yes' name='fixed' value={true} onClick={(e) => setIsFixed(e.target.value)}/>
                        <label htmlFor="yes">Yes</label><br />
                        <input type="radio" id='no' name='fixed' value={false} onClick={(e) => setIsFixed(e.target.value)}/>
                        <label htmlFor="no">No</label>
                    </form>
                </div>
                <div>
                    <select id="end-hour" name="end-hour">
                    <option value='' onClick={(e) => setParticionableHour(e.target.value)} defaultValue>Time of partition</option>
                    {
                        particionableHours.map((hour) => {
                            return(
                                <option name='end-hour' value={hour} onClick={(e) => setParticionableHour(e.target.value)}>{hour}</option>
                            );
                        })
                    }
                    </select>
                </div>
                <div>
                    <button id='add-block' type='submit' onClick={submitHandler}>Add</button>
                </div>
            </div>
        )
    } else {
        return null
    }
}