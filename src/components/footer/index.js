import React from 'react';
import './style.css';
import Logo from '../static/Logo.svg'

const Footer = () => {
    return (
        <div>
            <div className = "footerContainer">
                <img className = "logo" src = {Logo} alt = "Vegh Logo"/>
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
