import React from 'react'

export default function Post({ postInfo }) {

  const timeStamp = () => {
    const pastDate = new Date('2023-06-30T14:15:41.682Z');
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = currentDate.getTime() - pastDate.getTime();

    // Convert milliseconds to seconds, minutes, hours, and days
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days) {
      return `${days} d`;
    } else if (hours) {
      return `${hours} h`;
    } else if (minutes) {
      return `${minutes} m`;
    } else {
      return `${seconds} s`;
    }
  }

  return (
    <div className='w-full p-4 border-[#464b5f] border-b-[1px] '>
        <div>
            <div>{postInfo.author.username}</div>
            <div>{timeStamp(postInfo.createdAt)}</div>
        </div>
        <div>{postInfo.content}</div>
        <div>Images</div>
        <div>
            <button>Like</button>
            <button>Comment</button>
            <button>Share</button>
        </div>
    </div>
  )
}
