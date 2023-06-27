import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../authentication/useAuth';

export default function Landing() {
    const navigate = useNavigate();

    const { user, error, isLoading, logout} = useAuth();

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const [errors,setErrors] = useState(null);

    useEffect(()=>{
        // If the user is already logged in, redirect them to the home page.
        if(!isLoading && !user) {
            navigate('/login');
            console.log('User is not logged in');
        }
    },[isLoading, user])

    useEffect(()=>{
        fetchPosts();
    }, []);

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
    }

    

    return (
    <div>
        <button onClick={logout}>Logout</button>
    </div>
  );
};