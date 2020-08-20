import React from 'react'
import QRCode from 'qrcode.react'
import './style.css'
import hidden from './../static/hidden.svg'
import {motion,AnimatePresence} from "framer-motion"

const qrCode = (props) => {
    const {qrUrl,params} = props

    const showQr = () =>{
       let qr = document.getElementById("qrBlur").style.visibility
       if (qr == "visible"){
        document.getElementById("qrBlur").style.visibility = "hidden"
       }
       else {
        document.getElementById("qrBlur").style.visibility = "visible"
       }
        
    }

    return (
        <div className = "qrBox">
                <div className = "qrContainer">
                    <div className = "qrCode" onClick = {showQr}>
                        <QRCode value = {qrUrl}  size = "500"/>
                    </div>
                    <div className = "qrText">
                        <p className="room-lable">room ID</p>
                        <p className="room-ID">{params}</p>
                    </div>
                 </div>
                 
                <div className = "stackTop" id = "qrBlur" onClick = {showQr} >
                    {/* <img  id  = "hiddeneye" src={hidden} /> */}
                    <div id  = "hiddeneye" class="hidde-label"><img   src={hidden} />
                    <p>SHOW QR CODE</p>
                    </div>
                    <div className = "qrCode">
                        <QRCode value = {qrUrl}  size = "500"/>
                    </div>
                    <div className = "qrText">
                        <p className="room-lable">room ID</p>
                        <p className="room-ID">{params}</p>
                    </div>
                </div>
        </div>
    )
}

export default qrCode
