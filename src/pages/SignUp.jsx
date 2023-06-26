import { useState, useEffect } from 'react';

export default function Login() {
    const [isLoading, setIsLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');

    const [validationErrors, setValidationErrors] = useState('');

    const signUp = async(e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('phoneNumber', phoneNumber);
            formData.append('dob', dob);
            const response = await fetch('http://127.0.0.1:3000/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
            });
            const res = await response.json();
            
            if (response.ok) {
                // redirect and login the user
            } else {
                setValidationErrors(res.error.error_detail);
            }

        } catch(err) {
            setValidationErrors('Could not process your requrest at the moment. Please try again later.');  
        }

    }

  return (
    // The default screen will be showing the user in sign in mode.
    <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div> Logo </div>
        <h1>Sign Sign Up to FriendZone</h1>
        <form className="w-[40%] flex flex-col" onSubmit={signUpMode ? signUp : signIn}>
            {validationErrors && <div className="text-red-500">{validationErrors}</div>}
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" className="border-2 border-blue-800" onChange={e=>setEmail(e.currentTarget.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" className="border-2 border-blue-800" onChange={e=>setPassword(e.currentTarget.value)}/>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" className="border-2 border-blue-800" onChange={e=>setConfirmPassword(e.currentTarget.value)}/>
            
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" className="border-2 border-blue-800" onChange={e=>setFirstName(e.currentTarget.value)}/>
            
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" className="border-2 border-blue-800" onChange={e=>setLastName(e.currentTarget.value)}/>
            
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" name="phoneNumber" id="phoneNumber" className="border-2 border-blue-800" onChange={e=>setPhoneNumber(e.currentTarget.value)}/>
            
            <label htmlFor='dob'>Date of Birth</label>
            <input type="date" name="dob" id="dob" className="border-2 border-blue-800" onChange={e=>setDob(e.currentTarget.value)}/>
            <button type="submit" className='w-1/2 bg-slate-500 self-center'>Sign {signUpMode ? 'Up' : 'In'}</button>
        </form>
    </div>
  )
}
