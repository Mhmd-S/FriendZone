import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../authentication/useAuth';

import { useForm } from 'react-hook-form';


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

    const onSubmit = async(data) => {
        const signUpCreds = new URLSearchParams();

        for (const key of data) {
            signUpCreds.set(data[key]);
          }
          
        signUp(signUpCreds);
    }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
    <div>Logo</div>
    <h1>Sign Up to FriendZone</h1>
    <form className="w-[40%] flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="text-red-500">
          {Array.isArray(error) ? error.map((error, index) => (
            <span key={index}>{error.message}</span>
          )) : error.message}
        </div>
      )}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        {...register('email', { required: 'Email must be a valid email address', pattern: { value: /^\S+@\S+$/i, message: 'Email must be a valid email address'}, })}
        className="border-2 border-blue-800"
      />
      {errors.email && <div className='py-px text-sm text-red-500'>{errors.email?.message}</div>}

      <label htmlFor="username">Username</label>
      <input
        type="text"
        {...register('username', {
          required: 'Username must be 4-15 characters long and can only contain letters, numbers, and underscores',
          pattern: {
            value: /^[a-zA-Z0-9_]{4,15}$/,
            message: 'Username must be 4-15 characters long and can only contain letters, numbers, and underscores',
          },
        })}
        className="border-2 border-blue-800"
      />
      {errors.username && <div className='py-px text-sm text-red-500'>{errors.username?.message}</div>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        {...register('password', {
          required: 'Password must be 8-15 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,15}$/,
            message: 'Password must be 8-15 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
          },
        })}
        className="border-2 border-blue-800"
      />
      {errors.password && <div className='py-px text-sm text-red-500'>{errors.password?.message}</div>}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        {...register('confirmPassword', {
          required: 'Confirm Password is required',
          validate: (value) =>
            value === watchPassword.current || 'Passwords do not match',
        })}
        className="border-2 border-blue-800"
      />
      {errors.confirmPassword && <div className='py-px text-sm text-red-500'>{errors.confirmPassword?.message}</div>}

      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        {...register('firstName', {
          required: 'First Name can only contain letters and between 1 and 50 characters',
          pattern: {
            value: /^[a-zA-Z]{1,50}$/,
            message: 'First Name can only contain letters and between 1 and 50 characters',
          },
        })}
        className="border-2 border-blue-800"
      />
      {errors.firstName && <div className='py-px text-sm text-red-500'>{errors.firstName?.message}</div>}

      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        {...register('lastName', {
          required: 'Last Name can only contain letters and between 1 and 50 characters',
          pattern: {
            value: /^[a-zA-Z]{1,50}$/,
            message: 'Last Name can only contain letters and between 1 and 50 characters',
          },
        })}
        className="border-2 border-blue-800"
      />
      {errors.lastName && <div className='py-px text-sm text-red-500'>{errors.lastName?.message}</div>}

       <label htmlFor="dob">Date of Birth</label>
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
          className="border-2 border-blue-800"
        />
        {errors.dob && <div className='py-px text-sm text-red-500'>{errors.dob?.message}</div>}

        <button type="submit" className="w-1/2 bg-slate-500 self-center">
          Sign Up
        </button>
      </form>
    </div>
  )
}
