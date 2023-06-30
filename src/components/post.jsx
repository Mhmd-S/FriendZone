import React from 'react'

export default function Post({ postObj }) {
  console.log(postObj)
  return (
    <div>
        <div>
            <div>{postObj.author}</div>
            <div>{postObj.createdAt}</div>
        </div>
        <div>{postObj.content}</div>
        <div>Images</div>
        <div>
            <button>Like</button>
            <button>Comment</button>
            <button>Share</button>
        </div>
    </div>
  )
}
