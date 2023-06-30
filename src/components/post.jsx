import React from 'react'

export default function Post({ postInfo }) {
  return (
    <div>
        <div>
            <div>{postInfo.author.username}</div>
            <div>{postInfo.createdAt}</div>
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
