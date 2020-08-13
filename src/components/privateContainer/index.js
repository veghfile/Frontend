import React from 'react'
import QRCode from 'qrcode.react'
import './style.css'
import hidden from './../static/hidden.svg'
import publicRoom from './../static/Public_Room.svg';
import IconButton from '../../modules/IconButton/index';
import { v1 as uuid } from "uuid";
import Button from '../../modules/button/index';
import {createBrowserHistory} from 'history';
import Lock from '../static/lock.svg'



const PrivateContainer = (props) => {
    const {qrUrl} = props
    const history = createBrowserHistory({
        forceRefresh: true
        });
        function create() {
            const id = uuid();
            history.push(`/room/${id}`);
        }



    return (
        <div className = "qrBox public-box">
                <div className = "qrContainer publicContainer">
                    <div className = "qrCode" >
                        <img src={publicRoom} />
                    <p style={{ display: "block",textAlign: "center"}}>Private rooms can only be accessed by the second device using a link or QR Code. You do not need to be on the same network.</p>
                    </div>
                    <div className = "qrText privateButton">
                    <IconButton onClick={()=>create()} svg = {Lock}>Private Room</IconButton>
                    </div>
                 </div>
        </div>
    )
}

export default PrivateContainer
