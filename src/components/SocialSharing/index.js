import React from 'react'
import './style.css'
import IconButton from './../../modules/IconButton/index'
import whatsAppIcon from './../static/whatsapp.svg'
import copyLink from './../static/copylink.svg'
import { useAlert as UseAlert } from 'react-alert'
const socialSharing = ({params}) => {

    function copyToClipboard() {
        /* Get the text field */
        var input = document.createElement('input');
        input.setAttribute('value', params);
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 99999); /*For mobile devices*/
        var result = document.execCommand('copy');
        document.body.removeChild(input)      
        /* Copy the text inside the text field */
        alert.show('Copied to Clipboard!')
      }
      
    const alert = UseAlert()
    return (
        <div className = "socialSharing">
            <div className = "whatsapp button-container">
                {/* <IconButton svg = {whatsAppIcon}></IconButton> */}
                <IconButton onClick={()=>window.open(`https://web.whatsapp.com/send?text=Quick Join Now ${params}`)} svg = {whatsAppIcon}></IconButton>

            </div>
            <div className = "copyLink button-container">
                <IconButton
                     onClick={copyToClipboard}
                svg = {copyLink}></IconButton>
            </div>
        </div>
    )
}

export default socialSharing
