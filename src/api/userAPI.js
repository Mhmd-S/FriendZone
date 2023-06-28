
export async function signUp (signUpCreds) {
    try {
        const response = await fetch('http://127.0.0.1:3000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },//add cookiiess
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
        const response = await fetch('http://127.0.0.1:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              credentials: 'include',
              mode: 'cors',
              body: loginCreds.toString(),
        });
        
        const res = await response.json();
        return res;
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}

export async function logout() {
    try {
        const response = await fetch('http://127.0.0.1:3000/user/logout', {
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
        const response = await fetch('http://127.0.0.1:3000/user/auth', {
            method: 'GET',
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

export async function searchUsers (value, limit) {
    try{
        const url = (
            'http://127.0.0.1:3000/user/search?' +
            new URLSearchParams({ keyword : value, limit : 5 }).toString()
        );

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        })
        const res = await response.json()
        return res;
        console.log(res)
    }catch(err) {
        console.log('Could not proccess your request at the moment. Please try again later')
    }
}