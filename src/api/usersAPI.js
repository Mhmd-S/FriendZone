
export async function signUp (email, password, confirmPassword, firstName, lastName, phoneNumber, dob) {
    try {
        const response = await fetch('http://127.0.0.1:3000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: {email, password, confirmPassword, firstName, lastName, phoneNumber, dob},
        });
        const res = await response.json();
        if (res.status !== 'success') {
            throw new Error(res.data);
        }
        return res.data;
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
              body: loginCreds,
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

export async function logout() {
    try {
        const response = await fetch('http://127.0.0.1:3000/user/logout', {
            method: 'DELETE',
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