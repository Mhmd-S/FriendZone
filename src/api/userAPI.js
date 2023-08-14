
export async function signUp (signUpCreds) {
    try {
        const response = await fetch('https://friend-zone-2rm0.onrender.com/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                mode: 'cors',
                body: signUpCreds.toString(),
                
        });
        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}

export async function login(loginCreds) {
    try {
        // Convert the loginCreds object to URL-encoded string
        const body = new URLSearchParams(loginCreds).toString();

        const response = await fetch('https://friend-zone-2rm0.onrender.com/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            mode: 'cors',
            body: body, // Pass the URL-encoded string here
        });

        const res = await response.json();
        return res;
    } catch (err) {
        console.log('Could not process your request at the moment. Please try again later.');
    }
}

export async function logout() {
    try {
        const response = await fetch('https://friend-zone-2rm0.onrender.com/user/logout', {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
        });
        
        const res = await response.json();
    
        if (res.status !== 'success') {
            throw new Error(res.data);
        }
        return res.data;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export async function checkIfAuthenticated() {
    try {
        const response = await fetch('https://friend-zone-2rm0.onrender.com/user/auth', {
            method: 'GET',
            credentials: 'include',

        });
        
        const res = await response.json();
    
        if (res.status !== 'success') {
            throw new Error(res.data);
        }
        return res.data;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export async function searchUsers (value, page, limit) {
    try{
        console.log(limit)
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/search?' +
            new URLSearchParams({ keyword : value, page : page, limit: limit }).toString()
        );

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        })
        const res = await response.json()
        return res;
    }catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later')
    }
}

export async function getUser (username) {
    try{
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/get-user?' +
            new URLSearchParams({ username: username }).toString()
        );
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        })

        const res = await response.json()
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later')
    }
}

export async function getUserFriends() { // This will get the logged in user's friends and requests
    try {
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/get-user-friends'
        );
        const response = await fetch(url,
            {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            })

        const res = await response.json();
        return res;
    }catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later')
    }
}

export async function sendFriendRequest(userId) {
    try {
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/friend-request?' +
            new URLSearchParams({ userId: userId }).toString()
        )
        
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors'
        })

        const res = await response.json();
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.')
    }
}

export async function acceptFriendRequest(userId) {
    try {
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/friend-accept?' +
            new URLSearchParams({ userId: userId }).toString()
        )
            console.log(url, userId)
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors'
        })

        const res = await response.json()
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.')
    }
}

export async function declineFriendRequest(userId) {
    try{
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/friend-reject?' +
            new URLSearchParams({ userId: userId }).toString()
        )

        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        })

        const res = await response.json()
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.')
    }
}

export async function removeFriend(userId) {
    try{
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/friend-remove?' +
            new URLSearchParams({ userId: userId }).toString()
        )

        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        })

        const res = await response.json()
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.')
    }
}

export async function updateProfile (formData) {
    try{
        const url = (
            'https://friend-zone-2rm0.onrender.com/user/update-info'
        )

        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            mode: 'cors',
            body: formData
        })

        const res = await response.json()
        return res;
    } catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later.')
    }
}