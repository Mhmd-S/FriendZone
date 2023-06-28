import React, { useState } from 'react'

import * as userAPI from '../api/userAPI';

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState('');

    const handleOnChange = (e) => {
        setSearchInput(e.target.value);
        fetchSearchResults(e.target.value);
    }

    const fetchSearchResults = async(value) => {
        const res = await userAPI.searchUsers(value);

        if (res.status === 'success') {
            return;
        }
    }
    
    
    return (
        <div>
            <input type="text" placeholder="Search" value={searchInput} onChange={e=> handleOnChange(e)}/>
        </div>
    )
}

export default SearchBar