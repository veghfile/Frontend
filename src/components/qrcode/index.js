import React from 'react'
import QRCode from 'qrcode.react'
import './style.css'

const qrCode = (props) => {
    const {qrUrl} = props

    return (
        <div className = "qrContainer">
             <div className = "qrCode">
             <QRCode value = {qrUrl}  size = "500"/>
             </div>
             <div className = "qrText">
                 <p className="room-lable">room ID</p>
                 <p className="room-ID">HappyDolphines</p>
                 </div>
        </div>
    )
}

export default qrCode
