import React from 'react'
import './style.css'
import {motion} from "framer-motion"


const Button = (props) => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <motion.button className={className} {...other} transition = {{duration : 0.1}} whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}/>;
}

export default Button
