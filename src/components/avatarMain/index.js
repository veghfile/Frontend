import React from 'react'
import {AvatarGen} from '../../util/randomAvatarGen'
import UserSvg from '../static/user.svg'
import './style.css'
import {motion} from 'framer-motion'
const Avatar = ({index,children,...other}) => {
  let UserInfo = AvatarGen(index)

  
  return (
    <motion.div className="peer-avatar-You">
    <div className="flex-col-center-You">
        <motion.div className="userInfo-You" animate = {{y : 0 }} initial = {{y : -200 }} >
        <h2>{UserInfo?UserInfo.name:null}</h2>
        {UserInfo?children:null}
        </motion.div>
        <motion.img src={UserInfo?UserInfo.path:UserSvg} animate = {{y : 0}} initial = {{y : -200 }}/>
    </div>
</motion.div>
  )
}

export default Avatar
