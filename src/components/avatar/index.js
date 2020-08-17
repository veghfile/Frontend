import React from 'react'
import {AvatarGen} from '../../util/randomAvatarGen'
import UserSvg from '../static/user.svg'
const Avatar = ({index,children,nameID,...other}) => {
  let UserInfo = AvatarGen(index)  

  return (
    <div id={nameID} name={index} className="peer-avatar ">
    <div className="flex-col-center">
        <img src={UserInfo?UserInfo.path:UserSvg} />
        <div className="userInfo">
        <div>{UserInfo?children:null}</div>
        <h2>{UserInfo?UserInfo.name:null}</h2>
        </div>
    </div>
</div>
  )
}

export default Avatar
