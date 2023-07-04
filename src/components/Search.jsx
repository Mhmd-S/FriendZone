import React, { useState } from 'react'

const Search = () => {

  const [searchInput, setSearchInput] = useState('')
  const [searchResult, setSearchResults] = useState([])
  const [category, setCategory] = useState(0); // 0 = users, 1 = posts

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
  }

  return (
    <div className='h-full w-full overflow-y-auto flex flex-col bg-[#282c37] scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
      <h3 className='flex w-full sticky border-b-[1px] border-b-[#464b5f] px-4 py-2 items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"  className="w-8 h-8 fill-white pr-2">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
        </svg>
        <span className='text-xl text-white'>Search</span>
      </h3>

      <div className='w-full flex bg-[#313543] p-4 items-center justify-evenly'>
        <input className='w-[80%] p-2 outline-0 overflow-x-hidden rounded-md' type="text" placeholder="Search" />
        <button className='w-[15%] p-2 bg-[#787ad9] rounded-md text-white hover:bg-[#595aff]'>Search</button>
      </div>

      <ul className='w-full flex bg-[#1f232b]items-center justify-evenly text-[#8586f2] border-t-2 border-b-2 border-[#353a49] cursor-pointer font-semibold'>
        <li className={'w-1/2 p-2 h-full text-center ' + (category === 0 && 'bg-[#595aff] text-white' )} onClick={()=>setCategory(0)}>
          Users
        </li>
        <li className={'w-1/2 p-2 h-full text-center ' + (category === 1 && 'bg-[#595aff] text-white' )} onClick={()=>setCategory(1)}>
          Posts
        </li>
      </ul>

      <div className='w-full h-100% grow'>
        {(searchResult.length <= 0 && searchInput.trim().length <= 0) && <div className='w-full h-full flex justify-center items-center text-[#ffffff3f] text-2xl'>
            {category === 0 ? "Insert the name of a user to search" : "Search for posts with a certain keyword"}
          </div>}
        {searchResult && searchResult}
      </div>

    </div>
  )
}

export default Search