
export const getPosts = async(pageNum) => {
    try {
        const url = (
            'http://127.0.0.1:3000/post/posts?' +
            new URLSearchParams({ page : pageNum }).toString()
          );
          
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        });
        
        const res = await response.json();
        console.log(res);
        return res;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export const createPost = async(postData) => {
    try {
        const response = await fetch('http://127.0.0.1:3000/post/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData.toString(),
            credentials: 'include',
            mode: 'cors',
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}