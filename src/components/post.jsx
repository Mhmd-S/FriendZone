import React from 'react'

export default function post({ postObj }) {
  return (
    <div>
        {console.log(postObj)}
        <div></div>
        <div>
            <div>Username</div>
            <div>Timestamp</div>
        </div>
        <div>Post text</div>
        <div>Images</div>
        <div>
            <button>Like</button>
            <button>Comment</button>
            <button>Share</button>
        </div>
    </div>
  )
}
