import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as userAPI from '../api/userAPI';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (searchInput.trim() !== '') {
      const timeout = setTimeout(() => {
        fetchSearchResults(searchInput);
      }, 500); 
      setDebounceTimeout(timeout);
    } else {
      setSearchResult([]);
    }
  }, [searchInput]);

  const fetchSearchResults = async (value) => {
    const res = await userAPI.searchUsers(value, 8);

    if (res.status === 'success') {
      const users = res.data.map((user) => {
        return (
          <div key={user.username}>
            <Link onClick={()=>setSearchInput('')} >
              {user.username}
            </Link>
          </div>
        );
      });

      if (users.length === 0) {
        setSearchResult([<div key={'ft'}>No users found</div>,<div key={'lt'} className='max-w-full overflow-y-hidden'>Search more of {searchInput}</div>]);
      } else if (searchInput === '') {
        setSearchResult([]);
      }else {
        setSearchResult([...users, <div key={'lt'} className='w-full overflow-x-clip'>Search more {searchInput}</div>]);
      } 
    }
  };

  return (
    <div className='w-full h-[10%] relative flex flex-col items-center justify-center' >
      <div className='w-[90%] h-[85%] pl-2 text-[#9298a5] bg-[#282c37] outline-0 flex items-center rounded-md'>
        <input className='w-[90%] h-[85%] pl-2 text-[#9298a5] bg-[#282c37] outline-0 overflow-x-hidden' type="text" placeholder="Search"  onChange={(e) => setSearchInput(e.target.value)} onBlur={()=>setFocused(false)} onFocus={()=>setFocused(true)} value={searchInput} />
          <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{setSearchInput(''); setSearchResult([])}}  viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      </div>
      {(searchResult && focused) && <div className='w-[90%] absolute top-[80%] bg-[#2d313c] rounded-b-md px-2'>{searchResult}</div>}
    </div>
  );
};

export default SearchBar;
