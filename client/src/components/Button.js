import React,  {useState} from 'react';
import './Buttons.css'
import { PopUp } from './PopUp';

export const Button = () => {
    const [visibility, setVisibility] = useState(false)
    
    const closePopup = () => {
        setVisibility(false)
    }
    
    return (
        <>
            <button
                className="py-1 px-3 ml-4 inline-block bg-blue-400 hover:bg-blue-500 rounded-md "
                onClick={() => setVisibility(true)}
            >Add Event</button>
            <PopUp onClose={closePopup} show = {visibility} title="Hello world!">
                <h1>Hello This is Popup Content Area</h1>
                <h2>This is my lorem ipsum text here!</h2>
            </PopUp>
        </>
    );
}    
