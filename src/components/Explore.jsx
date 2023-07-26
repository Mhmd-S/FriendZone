import { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import * as postAPI from '../api/postAPI';
import Post from './Post';
import PostSingle from './PostSingle';

const Explore = () => {
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
            console.log(entry.isIntersecting);
            if (entry.isIntersecting) {
              setIsLoading(true);
              fetchPosts()
                .finally(() => setIsLoading(false));
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

        const res = await postAPI.getPosts(page, true);
        if (res.status === 'success') {
            if (res.data.length === 0) {
                setStopFetching(true);
                return;
            }

            const postEle = res.data.map((post) => {
                return (<Post key={post._id} postInfo={post} setShowPost={setShowPost} />);
            });
            setPosts([...posts, ...postEle]);
            setPage(page+1);
            return;
        }
        setErrors("Could not fetch posts");
    }

    // Show post in home

    return (
        <div className='h-full w-full bg-[#282c37] rounded-lg flex flex-col'>
            {showPost ? <PostSingle postInfo={showPost} setShowPost={setShowPost}/>
             :  
             <>
                <h3 className='flex w-full h-[10%] sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-8 h-8 pr-2">
                    <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
                    </svg>
                  <span className='text-xl text-white'>Explore</span>
                </h3>
                <div className=' flex flex-col w-full flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
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

export default Explore;