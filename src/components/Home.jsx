import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';

import Post from './Post';
import PostForm from './PostForm';
import { set } from 'react-hook-form';

const Landing = () => {
    const navigate = useNavigate();

    const { user, isLoading, logout, error} = useAuth();

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const [errors,setErrors] = useState(null);

    useEffect(()=>{
        fetchPosts();
    }, []);

    const fetchPosts = async() => {
        const res = await postAPI.getPosts(page);
        if (res.status === 'success') {
            const postEle = res.data.map((post) => {
                return (<Post key={post._id} postInfo={post} />);
            });
            setPosts(postEle);
            setPage(page+1);
            return;
        }
        setErrors("Could not fetch posts");
    }

    return (
        <div>
            <h3>Home</h3>
            <div>
                {user && <PostForm/>}
            </div>
            <div>
                {posts ? posts : <div>No posts</div>}
            </div>
        </div>
    );
}

export default Landing;