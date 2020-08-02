import React from 'react'
import QRCode from 'qrcode.react'
import './style.css'

const qrCode = (props) => {
    const url = "www.google.com" //this is a dummy link
    const {qrUrl} = props

    return (
        <div className = "qrContainer">
             <div className = "qrCode">
             <QRCode value = {qrUrl}  size = "500"/>
             </div>
             <div className = "qrText"><p>XYZ123</p></div>
        </div>
    )
}

export default qrCode
