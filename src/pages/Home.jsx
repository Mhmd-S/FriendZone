import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';

import PostForm from '../components/PostForm';
import SearchBar from '../components/SearchBar';

const Landing = () => {
    const navigate = useNavigate();

    const { user, isLoading, logout, error} = useAuth();

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

    // useEffect(()=>{
    //     fetchPosts();
    // }, []);

    const fetchPosts = async() => {
        const res = await postAPI.getPosts(page);

        if (res.status === 'success') {
            setPosts(res.data);
            setPage(page+1);
            return;
        }

        setErrors("Could not fetch posts");
    }

    return (
        <div>
            <div>
                <SearchBar/>
                <button onClick={logout}>Logout</button>
            </div>
            
            <PostForm />
        </div>
    );
}

export default Landing;