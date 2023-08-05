
import { Link } from 'react-router-dom';
import DefaultProfilePicture from './DefaultProfilePicture';

const MiniUser = ({userInfo}) => {
  return (
    <Link to={`/profile/${userInfo.username}`} className='w-full h-full p-6 border-b-[1px] border-white text-white flex items-center bg-[#313543]'>
        {userInfo.profilePicture ? <img src={userInfo.profilePicture} alt="Profile Picture" className='w-10 h-10 rounded-full'/> : <DefaultProfilePicture size={10}/>}
        <div className='w-full h-full flex justify-between items-center pl-4'>
          <span>{userInfo.username}</span>
          <span>{userInfo.bio}</span>
          <div className='w-1/2 flex flex-col items-end text-sm'>
            <span>
              <span className='text-[#606984]'>Friends:</span> {userInfo.friendsCount}
            </span>
            <span>
              <span className='text-[#606984]'>Posts:</span> {userInfo.postsCount}
            </span>
          </div>
        </div>           
    </Link>
  )
}

export default MiniUser