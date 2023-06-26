
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
        return res;
    } catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');  
    }
}

export async function login(email,password) {
    try {
        const response = await fetch('http://127.0.0.1:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body:{email, password},
        });
        
        const res = await response.json();
    
        return res; // Get the user info
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
    
        return res; // Get the user info
    }catch(err) {
        console.log('Could not process your requrest at the moment. Please try again later.');
    }
}