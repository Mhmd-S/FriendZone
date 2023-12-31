import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfilePicture from './DefaultProfilePicture';
import Spinner from './Spinner';

import * as userAPI from '../api/userAPI';

const SearchBar = ({ chatMode, handleSetRecipient }) => {
  
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (searchInput.trim() !== '') {
      const timeout = setTimeout(() => {
        setIsLoading(true);
        fetchSearchResults(searchInput)
          .then(() => setIsLoading(false));
      }, 500);
      setDebounceTimeout(timeout);
    } else {
      setSearchResult([]);
    }
  }, [searchInput]);

  const fetchSearchResults = async (value) => {
    
    const res = await userAPI.searchUsers(value, 1,5);

    if (res.status === 'success') {

      if (res.data.length === 0) {
        setSearchResult([<div className='w-full text-center text-white p-1' key={'messageNoUsersFound'}>No Users Found</div>, <div className='w-full truncate text-center text-white cursor-pointer hover:underline p-1' key={"searchPostsKeyword"}>Search Posts with {searchInput}</div>]);
        return;
      }
      
      let users;

      chatMode ? 
        users = res.data.map((user) => {
          return (
            <div onClick={()=>handleSetRecipient(user)} className='w-[95%] h-[4rem] bg-[#60698459] my-2 p-2 rounded-md flex items-center' key={user.username}>
              {user.profilePicture ? <img className='w-12 h-12 rounded-full' src={user.profilePicture} alt='Profile Picture' /> : <DefaultProfilePicture size={12} />} 
              <p className='pl-2 text-white'>{user.username}</p>
            </div>
          );
        })
      :
        users = res.data.map((user) => {
          return (
            <Link to={'/profile/' + user.username} className='w-[90%] h-[4rem] bg-[#60698459] my-2 p-1 rounded-md flex items-center' key={user.username}>
              {user.profilePicture ? <img className='w-12 h-12 rounded-full' src={user.profilePicture} alt='Profile Picture' /> : <DefaultProfilePicture size={12} />} 
              <p className='pl-2 text-white'>{user.username}</p>
            </Link>
          );
        });

      setSearchResult([...users]);
    }
  };

  return (
    <div className='w-full relative flex flex-col items-center justify-center mb-2 md:border-b-0'>
      <div className='w-full h-[85%] pl-2 text-[#9298a5] bg-[#282c37] outline-0 flex items-center rounded-md'>
        <input className='w-[90%] h-[85%] pl-2 p-4 text-[#9298a5] bg-[#282c37] outline-0 overflow-x-hidden' type="text" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
        <svg onClick={()=>setSearchInput('')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 cursor-pointer pr-2">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      </div>
      <div className='w-full max-h-[350%] absolute top-[80%] bg-[#3b4358] px-2 flex flex-col items-center flex-grow overflow-y-scroll scrollbar:bg-blue-500 rounded-b-lg scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
        {isLoading ? <Spinner size={12} /> : searchResult}
      </div>
    </div>
  );
};

export default SearchBar;
