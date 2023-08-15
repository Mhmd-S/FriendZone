
export const getPosts = async(pageNum, explore) => {
    try {
        const url = (
            'https://friendzone-backend-production.up.railway.app/post/posts?' +
            new URLSearchParams({ page : pageNum }).toString()
          );
          
        const response = await fetch(url, {
            method: 'GET',
            credentials: explore ?  'omit' : 'include',
            mode: 'cors',
        });
        
        const res = await response.json();
        console.log(res);
        return res;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export const searchPosts = async(searchQuery, page, limit) => {
    try {
        const url = (
            'https://friendzone-backend-production.up.railway.app/post/search?' +
            new URLSearchParams({ keywords: searchQuery, page: page, limit : limit }).toString()
          );
          
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        });
        
        const res = await response.json();
        return res;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export const createPost = async(postData) => {
    try {
        const response = await fetch('https://friendzone-backend-production.up.railway.app/post/create-post', {
            method: 'POST',
            body: postData,
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}

export const likePost = async(postId) => {
    try {
        const response = await fetch(`https://friendzone-backend-production.up.railway.app/post/like/${postId}`, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}

export const unlikePost = async(postId) => {
    try {
        const response = await fetch(`https://friendzone-backend-production.up.railway.app/post/unlike/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}


export const deletePost = async(postId) => {
    try {
        const response = await fetch(`https://friendzone-backend-production.up.railway.app/post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your request at the moment. Please try again later.');
    }
}
