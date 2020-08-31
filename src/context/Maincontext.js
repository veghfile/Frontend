import React, {useState,useContext, createContext,useEffect} from 'react'
import {clipimg} from '../util/clipimg';

const main = createContext();

export const Maincontext = (props) => {

  const [imgblob,setImgblob] = useState("gdrg")
 useEffect(() => {
   clipimg(setImgblob)
 }, [])

  return (
    <main.Provider value={[imgblob,setImgblob]}>
      {props.children}
    </main.Provider>
  )
}

