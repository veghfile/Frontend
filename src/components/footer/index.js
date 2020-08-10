import React from 'react';
import './style.css';

const Footer = () => {
    return (
        <div>
            <div className = "footerContainer">
                <p className = "logo">© Vegh</p>
                <div className = "linkContainer">
                <p className = "about"><a href = "www.google.com">Terms of Service</a><span> |</span></p>
                <p className = "tos"><a href = "www.google.com">About</a><span> |</span></p>
                <p className = "privacy"><a href = "www.google.com">Privacy</a></p>
                </div>
            </div>
        </div>
    )
}

export default Footer
