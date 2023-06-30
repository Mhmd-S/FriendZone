import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import * as userAPI from '../api/userAPI';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const handleOnChange = (e) => {
    setSearchInput(e.target.value);
    fetchSearchResults(e.target.value);
  };

  const fetchSearchResults = async (value) => {

    if (value === '') {
      setSearchResult([]);
      return;
    }

    const res = await userAPI.searchUsers(value, 8);

    if (res.status === 'success') {
      const users = res.data.map((user) => {
        return (
          <div key={user.username}>
            <Link to={`/profile/${user.username}`} onClick={()=>setSearchInput('')} >
              {user.username}
            </Link>
          </div>
        );
      });

      if (users.length === 0) {
        setSearchResult(<div>No users found</div>);
      } else {
        setSearchResult(users);
      }
    }

    

  };

  return (
    <div>
      <input type="text" placeholder="Search" value={searchInput} onChange={(e) => handleOnChange(e)} />
      {searchResult && searchResult}
    </div>
  );
};

export default SearchBar;
