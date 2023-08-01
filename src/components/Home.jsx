import { useState, useEffect, useRef } from 'react';
import useAuth from '../authentication/useAuth';
import * as postAPI from '../api/postAPI';
import Post from './Post';
import PostForm from './PostForm';
import PostSingle from './PostSingle';
import Spinner from './Spinner';

const Landing = () => {
    const { user} = useAuth();

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [ showPost, setShowPost ] = useState(null);
    const [errors,setErrors] = useState(null);
    const [stopFetching, setStopFetching] = useState(false); 
    const containerRef = useRef(null);

    useEffect(()=>{
        fetchPosts();
    }, []);

    useEffect(() => {
    
        const container = containerRef.current;
    
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        };
    
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              fetchPosts()
            }
          },
          options
        );
    
        if (container) {
          observer.observe(container);
        }
    
        return () => {
          observer.disconnect();
        };
      }, [posts]);

    const fetchPosts = async() => {
        if (stopFetching) {
            return;
        }
        setIsLoading(true);
        const res = await postAPI.getPosts(page);
        if (res.status === 'success') {
            if (res.data.length === 0) {
                setStopFetching(true);
                return;
            }

            const postEle = res.data.map((post) => {
                return (<Post key={post._id} postInfo={post} setShowPost={setShowPost} />);
            });

            setPosts((prevPosts) => prevPosts.concat(postEle));
            setPage((prevPage) => prevPage + 1);
            setIsLoading(false);
            return;
        }
        setErrors("Could not fetch posts");
        setIsLoading(false);
    }

    return (
        <div className='h-full w-full bg-[#282c37] rounded-lg flex flex-col md:grid md:grid-rows-[10%_90%] md:grid-cols-1'>
            {showPost ? <PostSingle postInfo={showPost} setShowPost={setShowPost}/>
             :  
             <>
                <h3 className='flex w-full sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-8 h-8 pr-2">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    <span className='text-xl text-white'>Home</span>
                </h3>
                
                <div className=' flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
                    {user && <PostForm setPosts={setPosts} setShowPost={setShowPost}/>}
                    {errors && <div className='text-red-500 text-center'>{errors}</div>}
                    {posts && posts.length === 0 && <div className='text-center text-white'>No posts</div>}
                    {posts.length > 0 && 
                        <>
                            {posts}
                            {isLoading ? 
                              <Spinner size={12} /> 
                            :
                              <div ref={containerRef} className='border-[1px] border-transparent'></div>
                            }
                        </>
                    }
                </div>
            </>
            }
        </div>
    );
}

export default Landing;