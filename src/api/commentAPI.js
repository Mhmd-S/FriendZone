
// Test these! and modify the postAPI.js
export const getComment = async(commentId) => {
    try {
        const url = `https://friend-zone-2rm0.onrender.com:10000/comment/${commentId}`;

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        });

        const result = await response.json();
        return result;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Try again later!');
    }
}

export const getComments = async(pageNum, postId) => {
    try {
        const url = (
            'https://friend-zone-2rm0.onrender.com:10000/comment/post?' +
            new URLSearchParams({ id: postId, page : pageNum }).toString()
        )

        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        });

        const result = await response.json();
        return result;
    } catch (err) {
        console.log('Could not proccess your request at the moment. Try again later!')
    }
}

export const addComment = async(commentData, postId) => {
    try {
        const url = `https://friend-zone-2rm0.onrender.com:10000/comment/${postId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: commentData.toString(),
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not proccess your requrest at the moment. Please try again later.');  
    }
}

export const deleteComment = async(commentId) => {
    try {
        const url = `https://friend-zone-2rm0.onrender.com:10000/comment/${commentId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
        })

        const result = await response.json();
        return result;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Plase try again later.')
    }  
}

export const addLike = async(commentId) => {
    try{
        const url = `https://friend-zone-2rm0.onrender.com:10000/comment/likes/${commentId}`;
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
        })

        const result = await response.json();
        return result;  
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.');
    }
}

export const deleteLike = async(commentId) => {
    try{
        const url = `https://friend-zone-2rm0.onrender.com:10000/comment/likes/${commentId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
        })

        const result = await response.json();
        return result;  
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.');
    }
}