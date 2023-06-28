import React, { useState } from 'react'

import * as userAPI from '../api/userAPI';

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSerachResult] = useState([]); // This will be an array of divs containing the user information. To be replaced by a comp

    const handleOnChange = (e) => {
        setSearchInput(e.target.value);
        fetchSearchResults(e.target.value);
    }

    const fetchSearchResults = async(value) => {
        if (value === '') {
            setSerachResult([]);
            return;
        }

        const res = await userAPI.searchUsers(value, 8);

        if (res.status === 'success') {
            const users = res.data.map(user=> {
                // return a div containing the user information
                return (
                    <div key={user.username}>
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                    </div>
                )
            })
            
            if (users.length === 0) {
                setSerachResult(<div>No users found</div>)   
            } else {
                setSerachResult(users);
            }
        }
    }
    
    return (
        <div>
            <input type="text" placeholder="Search" value={searchInput} onChange={e=> handleOnChange(e)}/>
            {searchResult && searchResult}
        </div>
    )
}

export default SearchBar