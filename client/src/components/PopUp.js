import React, {useState} from 'react';
import Static from './Static';
import Dynamic from './Dynamic'
import './PopUp.css';

function PopUp(props) {
    const [staticc, setStaticc] = useState('');
    const [dynamic, setDynamic] = useState('');

    const handleClickStatic = () => {
            setStaticc('static');
            setDynamic('');
    }

    const handleClickDynamic = () => {
        setStaticc('');
        setDynamic('dynamic');
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    X
                </button>
                <div id = 'options'>
                    <button id = 'static' value='static' onClick={handleClickStatic}>
                        Static
                    </button>
                    <button id = 'dynamic' value='dynamic' onClick={handleClickDynamic}>
                        Dynamic
                    </button>
                </div>
                {props.children}
                <Static staticc = {staticc} slots={props.slots} setSlots={props.setSlots}/>
                <Dynamic dynamic = {dynamic} setData = {props.setData} data={props.data}/>
            </div>
        </div>
    ) : null
}

export default PopUp