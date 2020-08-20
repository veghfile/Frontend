import React from 'react';
import './style.css';
import Logo from '../static/Logo.svg'
import {motion} from 'framer-motion';

const Footer = () => {
    return (
        <div>
            <motion.div className = "footerContainer" initial = {{y : +100}} animate = {{y : 0}}>
                <img className = "logo" src = {Logo} alt = "Vegh Logo"/>
                <div className = "linkContainer">
                <p className = "about"><a href = "www.google.com">About</a><span> |</span></p>
                <p className = "tos"><a href = "www.google.com">Terms of Service</a><span> |</span></p>
                <p className = "privacy"><a href = "www.google.com">Privacy</a></p>
                </div>
            </motion.div>
        </div>
    )
}

export default Footer
