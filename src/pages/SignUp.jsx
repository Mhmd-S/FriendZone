import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../authentication/useAuth';
import { useForm } from 'react-hook-form';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const watchPassword = watch('password', '');

    const {signUp, 
          isLoading, 
          error, 
          user} = useAuth();

    useEffect(()=>{
        // If the user is already logged in, redirect them to the home page.
        if(!isLoading && user) {
            navigate('/home');
            console.log('User is already logged in');
        }
    },[isLoading, user])

    const onSubmit = async (data) => {
      const signUpCreds = new URLSearchParams();
    
      for (const key in data) {
        signUpCreds.set(key, data[key]);
      }
    
      await signUp(signUpCreds);

      if (!error) {
        navigate('/login');
      }
    };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#282c37] text-white">
      <Link to={'/home'}>
        <Logo/>
      </Link>
      <h1 className='text-xl pt-2'>Sign Up to FriendZone</h1>
      {isLoading ? <div className='w-full h-full flex justify-center items-center'>
        <Spinner size={20}/>
      </div> : 
      <form className="w-[80%] h-[80%] flex flex-col items-center justify-evenly relative" onSubmit={handleSubmit(onSubmit)}>

      <div className='w-1/3 h-1/3 p-4 absolute bg-[#14161bda] text-white -right-16 -top-16 border-[#787ad9] border-2'>
        <p className="text-md">
          Welcome to FriendZone! We're so excited to have you here.
          Please fill out the form to get started.
          Also, please keep in mind that this is a demo site, so if you find any bugs, please let us know!
          &#10084;&#65039;
        </p>
      </div>

        <label htmlFor="email" className='hidden'>Email</label>
        <input
          type="email"
          placeholder='Email'
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.email || error?.email ? 'border-red-500 focus:border-red-500' : '')}
          {...register('email', { required: 'Email must be a valid email address', pattern: { value: /^\S+@\S+$/i, message: 'Email must be a valid email address'}, })}
        />
        {errors?.email && <div className='py-px text-sm text-red-500'>{errors.email.message}</div>} {/* Client Validation */}
        {error?.email && <div className='py-px text-sm text-red-500'>{error.email}</div>} {/* Server Validation */}

        <label htmlFor="username" className='hidden'>Username</label>
        <input
          type="text"
          placeholder='Username'
          {...register('username', {
            required: 'Username must be 4-15 characters long and can only contain letters, numbers, and underscores',
            pattern: {
              value: /^[a-zA-Z0-9_]{4,15}$/,
              message: 'Username must be 4-15 characters long and can only contain letters, numbers, and underscores',
            },
          })}
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[#787ad9] outline-none " + (errors?.username || error?.username ? 'border-red-500 focus:border-red-500' : '')}
        />
       {errors?.username && <div className='py-px text-sm text-red-500'>{errors.username.message}</div>}
        {error?.username && <div className='py-px text-sm text-red-500'>{error.username}</div>}

        <label htmlFor="password" className='hidden'>Password</label>
        <input
          type="password"
          placeholder='Password'
          {...register('password', {
            required: 'Password must be 8-15 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,15}$/,
              message: 'Password must be 8-15 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
            },
          })}
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.password || error?.password ? 'border-red-500 focus:border-red-500' : '')}
        />
        {errors?.password && <div className='py-px text-sm text-red-500'>{errors.password.message}</div>}
        {error?.password && <div className='py-px text-sm text-red-500'>{error.password}</div>}

        <label htmlFor="confirmPassword" className='hidden'>Confirm Password</label>
        <input
          placeholder='Confirm Password'
          type="password"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) =>
              value !== watchPassword.current || 'Passwords do not match',
          })}
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.confirmPassword || error?.confirmPassword ? 'border-red-500 focus:border-red-500' : '')}
        />
        {errors?.confirmPassword && <div className='py-px text-sm text-red-500'>{errors.confirmPassword.message}</div>}
        {error?.confirmPassword && <div className='py-px text-sm text-red-500'>{error.confirmPassword}</div>}

        {/* <label htmlFor="firstName" className='hidden'>First Name</label>
        <input
          type="text"
          placeholder='First Name'
          {...register('firstName', {
            required: 'First Name can only contain letters and between 1 and 50 characters',
            pattern: {
              value: /^[a-zA-Z]{1,50}$/,
              message: 'First Name can only contain letters and between 1 and 50 characters',
            },
          })}
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.firstName || error?.firstName ? 'border-red-500' : '')}
        />
        {errors?.firstName && <div className='py-px text-sm text-red-500'>{errors.firstName.message}</div>}
        {error?.firstName && <div className='py-px text-sm text-red-500'>{error.firstName}</div>}

        <label htmlFor="lastName" className='hidden'>Last Name</label>
        <input
          type="text"
          placeholder='Last Name'
          {...register('lastName', {
            required: 'Last Name can only contain letters and between 1 and 50 characters',
            pattern: {
              value: /^[a-zA-Z]{1,50}$/,
              message: 'Last Name can only contain letters and between 1 and 50 characters',
            },
          })}
          className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.lastName || error?.lastName ? 'border-red-500' : '')}
        /> 
        {errors?.lastName && <div className='py-px text-sm text-red-500'>{errors.lastName?.message}</div>}
        {error?.lastName && <div className='py-px text-sm text-red-500'>{error.lastName}</div>} */}

         <label htmlFor="dob" className='hidden'>Date of Birth</label>
          <input
            type="date"
            {...register('dob', {
              required: 'Date of Birth is required',
              min: {
                value: '1920-01-01',
                message: 'Date of Birth must be after 1920-01-01',
              },
              max: {
                value: '2023-01-01',
                message: 'Date of Birth must be before 2023-01-01',
              },
            })}
            className={"w-2/5 py-2 px-4 bg-[#14161b] border-[#464b5f] border-[1px] rounded-md focus:border-[1px] focus:border-[#787ad9] outline-none " + (errors?.dob || error?.dob ? 'border-red-500 focus:border-red-500' : '')}
          />
          {errors?.dob && <div className='py-px text-sm text-red-500'>{errors.dob.message}</div>}
          {error?.dob && <div className='py-px text-sm text-red-500'>{error.dob}</div>}

          <button type="submit" className="w-1/3 py-2 bg-[#595aff] rounded-lg mt-2 self-center">
            Sign Up
          </button>
          <Link to={'/login'} className='text-md text-slate-500 underline'>
            Login
          </Link>
        </form>
        }
      </div>
  ) 
} 
