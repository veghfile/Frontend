import React from 'react'
import './style.css'
import IconButton from './../../modules/IconButton/index'
import whatsAppIcon from './../static/whatsapp.svg'
import copyLink from './../static/copylink.svg'

const socialSharing = () => {
    return (
        <div className = "socialSharing">
            <div className = "whatsapp">
                <IconButton svg = {whatsAppIcon}></IconButton>
            </div>
            <div className = "copyLink">
                <IconButton svg = {copyLink}></IconButton>
            </div>
        </div>
    )
}

export default socialSharing
