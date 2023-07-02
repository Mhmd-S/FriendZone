import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';

import Post from './Post';
import PostForm from './PostForm';
import PostSingle from './PostSingle';

const Landing = () => {
    const navigate = useNavigate();

    const { user, isLoading, logout, error} = useAuth();

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const [ showPost, setShowPost ] = useState(null);

    const [errors,setErrors] = useState(null);

    useEffect(()=>{
        fetchPosts();
    }, []);

    const fetchPosts = async(pageOpt=page) => {
        const res = await postAPI.getPosts(pageOpt);
        if (res.status === 'success') {
            const postEle = res.data.map((post) => {
                return (<Post key={post._id} postInfo={post} setShowPost={setShowPost} />);
            });
            postEle.reverse();
            setPosts(postEle);
            setPage(pageOpt+1);
            return;
        }
        setErrors("Could not fetch posts");
    }

    // Show post in home

    return (
        <div className='h-full w-full overflow-y-scroll bg-[#282c37] scrollbar:bg-blue-500'>
            {showPost ? <PostSingle postInfo={showPost} setShowPost={setShowPost}/>
             :  
             <>
                <h3 className='flex w-full sticky border-b-[1px] border-b-[#464b5f] px-4 py-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-white pr-2">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    <span className='text-xl text-white'>Home</span>
                </h3>
                {user && <PostForm fetchPosts={fetchPosts}/>}
                <div>
                    {posts ? posts : <div>No posts</div>}
                </div>
            </>
            }
        </div>
    );
}

export default Landing;