import { useState, useEffect } from 'react';

export default function Landing() {
  
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [errors,setErrors] = useState(null);

    const fetchPosts = async() => {
        try {

            const response = await fetch(`http://127.0.0.1:3000/posts?page=${page}`, {
                method: 'GET',
            });
            const res = await response.json();
            if (response.ok) {
                if (!res.data && !res.data.length > 0) {
                    setErrors('No posts found.');
                } else {
                    setPosts(posts.concat(res.data));
                    setPage(page+1);
                }
            } 
        } catch(err) {
            setErrors('Could not process your requrest at the moment. Please try again later.');
        }
        setIsLoading(false);
    }

    useEffect(()=>{
        fetchPosts();
    }, []);

    return (
    <div>

    </div>
  );
};