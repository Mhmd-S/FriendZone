import { useState, useEffect, useRef } from 'react';
import * as userAPI from '../api/userAPI';
import * as postAPI from '../api/postAPI';
import MiniUser from './MiniUser';
import Post from './Post';
import PostSingle from './PostSingle';
import Spinner from './Spinner';

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [category, setCategory] = useState(0); // 0 = users, 1 = posts
  const [page, setPage] = useState(1);
  const [showPost, setShowPost] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);

  const containerRef = useRef(null);

  useEffect(()=>{
    setSearchResult([]);
    setPage(1);
    setStopFetching(false);
  }, [category, searchInput])
  
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
          setIsLoading(true);
          fetchSearchResults()
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
  }, [searchResult]);


  const fetchSearchResults = async() => {
    if (stopFetching) {
      return;
    }
    setIsLoading(true);

    if (searchInput.trim() === '') {
      setSearchResult([]);
      setIsLoading(false);
      return;
    }

    let res; 
    
    if (category === 0) {
      res = await userAPI.searchUsers(searchInput, page, 5);
    }  else {
      res = await postAPI.searchPosts(searchInput, page, 10);
    }
    if (res.status === 'error') {
      setSearchResult([<div key={'problemEcnounterdKey'}>A problem was encounterd. Try again later</div>]);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0 && page === 1) {
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0 && page > 1) {
      setIsLoading(false);
      setStopFetching(true);
      return;
    }

    let results;
    if (res.status === 'success') {
      if (category === 0) {
        results = res.data.map((user) => {
          return (
           <MiniUser userInfo={user} key={user.username} />
          );
        });
      } else {
        results = res.data.map((post) => {
          return (
            <Post postInfo={post} setShowPost={setShowPost} key={post._id}/>
          );
        });
      }

      setPage(page + 1)
      setSearchResult([...searchResult,...results]); 
      setIsLoading(false); 
    }
  }

  return (
    <div className='h-full w-full bg-[#282c37] rounded-lg flex flex-col md:grid md:grid-rows-[10%_12%_8%_90%] md:grid-cols-1'>
      {showPost ? <PostSingle postInfo={showPost} setShowPost={setShowPost}/> 
      :
      <>
        <h3 className='flex w-full sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9"  className="w-8 h-8  pr-2">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
          <span className='text-xl text-white'>Search</span>
        </h3>

        <form onSubmit={e=>{ e.preventDefault(); fetchSearchResults();}}  className='w-full flex bg-[#313543] p-4 items-center justify-evenly'>
          <input className='w-[75%] p-2 outline-0 overflow-x-hidden rounded-md' 
                  type="text" 
                  placeholder="Search" 
                  onChange={e=>setSearchInput(e.target.value)}/>
          <button type='submit' className='w-[20%] p-2 bg-[#787ad9] rounded-md text-white hover:bg-[#595aff]'>Search</button>
        </form>

        <ul className='w-full flex bg-[#1f232b]items-center justify-evenly text-[#8586f2] border-t-2 border-b-2 border-[#353a49] cursor-pointer font-semibold'>
          <li className={'w-1/2 p-2 h-full flex justify-center items-center ' + (category === 0 && 'bg-[#595aff] text-white' )} onClick={()=>setCategory(0)}>
            Users
          </li>
          <li className={'w-1/2 p-2 h-full flex justify-center items-center ' + (category === 1 && 'bg-[#595aff] text-white' )} onClick={()=>setCategory(1)}>
            Posts
          </li>
        </ul>

        <div className='w-full h-[70%] flex flex-col '>
              {(searchResult.length <= 0 && searchInput.trim().length <= 0) && 
              <div className='w-full h-full flex justify-center items-center text-[#ffffff3f] text-2xl'>
                <span className='text-center'>{category === 0 ? "Insert the name of a user to search" : "Search for posts with a certain keyword"}</span>
              </div>}
              {searchResult.length > 0 && 
              <div className='w-full h-full grid grid-flow-row grid-cols-1 auto-rows-min overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
                {searchResult}
                {isLoading ? 
                  <Spinner size={12} /> 
                :
                  <div ref={containerRef} className='border-[1px] border-transparent'></div>
                }
              </div>
              }
        </div>
      </>  
      }
    </div>
  )
}

export default Search;