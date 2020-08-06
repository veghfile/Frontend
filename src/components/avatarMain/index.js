import React from 'react'
import {AvatarGen} from '../../util/randomAvatarGen'
import UserSvg from '../static/user.svg'
import './style.css'
const Avatar = ({index,children,...other}) => {
  let UserInfo = AvatarGen(index)
  console.log(UserInfo);
  
  return (
    <div className="peer-avatar-You">
    <div className="flex-col-center-You">
        <div className="userInfo-You">
        <h2>{UserInfo?UserInfo.name:null}</h2>
        {UserInfo?children:null}
        </div>
        <img src={UserInfo?UserInfo.path:UserSvg} />
    </div>
</div>
  )
}

export default Avatar
