import React from 'react';
import './style.css';
import IconButton from '../../modules/IconButton/index';
import whatsAppIcon from './../static/whatsapp.svg';
import copyLink from './../static/copylink.svg';
import Lock from '../static/lock.svg'
import Button from '../../modules/button/index';
import {hri} from 'human-readable-ids'
import {createBrowserHistory} from 'history';
import { useAlert as UseAlert } from 'react-alert'


const socialSharing = ({params}) => {
    const history = createBrowserHistory({
        forceRefresh: true
        });
        function create() {
            const id = hri.random();
            history.push(`/room/${id}`);
        }

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
        <div>
            <p className="private-text">Private rooms can only be accessed by the second device using a link or QR Code. You do not need to be on the same network.</p>
        <div className = "socialSharing">
            <div className = "whatsapp button-container">
                {/* <IconButton svg = {whatsAppIcon}></IconButton> */}
                <IconButton svg = {whatsAppIcon} onClick={()=>window.open(`https://web.whatsapp.com/send?text=Quick Join Now ${params}`)}></IconButton>

            </div>
            <div className = "copyLink button-container">
                <IconButton svg = {copyLink}  onClick={copyToClipboard}></IconButton>
            </div>
            <div className = "PrivateLink button-container">
            <IconButton onClick={()=>create()} svg = {Lock}>Private Room</IconButton>
            </div>
        </div>
        </div>
    )
}

export default socialSharing
