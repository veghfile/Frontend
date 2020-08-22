import React, { useEffect, useState } from "react";
import './style.css';
import { Checkbox } from 'pretty-checkbox-react';
import 'pretty-checkbox'
import Avatar from '../avatar/index'
import {motion, AnimatePresence} from 'framer-motion'


const AvatarSelector = ({nameID,index,peersAddCallback,peersRemoveCallback,checkReset,checkCallback,check}) => {

  const [checked, setChecked] = useState(false);
  const [name,setName] = useState("")


 
  const handleChange = React.useCallback((e) => {
    document.getElementById(nameID).style.border = check===false&& checked?"3px solid rgb(199 199 199)":"3px solid #16BAC5";
    setChecked(prev => !prev);
    setName(e.target.name)
  }, [check,checked]);

  useEffect(()=>{
    setChecked(false)
    document.getElementById(nameID).style.border = document.getElementById(nameID).style.border = "3px solid rgb(199 199 199)";
    checkCallback()
  },[checkReset])

  useEffect(()=>{
    setChecked(false)
    document.getElementById(nameID).style.border = check? "3px solid rgb(22, 186, 197)":"3px solid rgb(199 199 199)";
    checkCallback()
  },[check])
  

  useEffect(()=>{
    setChecked(false)
    checkCallback()
  },[])

  useEffect(() => {
      if (checked) {
        peersAddCallback(name)
      } else{
        peersRemoveCallback(name)
      }
  }, [checked]);

  return (
    <AnimatePresence>
    <motion.div exit = {{y : 100 , opacity : 0}}className="selector-wrapper" id={nameID} initial = {{ x : 100 ,opacity : 0}} animate = {{opacity : 1 , x : 0}} transition = {{duration : 0.3}}>
    <Checkbox state={checked} name={nameID} className="pretty state p-success
state p-success p-svg p-round p-pulse" onChange={handleChange}>
    <div className="state p-success">
        <svg className="svg svg-icon" viewBox="0 0 20 20">
                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style={{stroke: "white", fill: "white" }}></path>
            </svg>
        </div>
    </Checkbox>
      <Avatar nameID={nameID}  index={index}/>
    </motion.div>
    </AnimatePresence>
  )
}

export default AvatarSelector
