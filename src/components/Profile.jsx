import React, { useEffect } from 'react'
import useAuth from '../authentication/useAuth'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, error, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  },[])

  return (
    <div>
      <h2>Your Profile</h2>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <h5>Welcome to your profile {user?.id}!</h5>
    </div>

  )
}

export default Profile