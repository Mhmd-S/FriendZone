// AuthContext.js

import React, { createContext, useState, useMemo, useHistory, useLocation, useEffect, useContext } from 'react';

import * as userAPI from '../api/usersAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // To keep track of the user current location
  const history = useHistory(); 
  const location = useLocation();

  // Whenever the user changes the location, we want to clear the error
  useEffect(()=>{
    if (error) setError(null);
  },[location.pathName])

  // Check if user already has a session, if so, set the user state and finaly set the initail loading to false.
  useEffect(()=>{
    userAPI.getCurrentUser()
      .then(user => setUser(user))
      .catch(err => {}) // Do nothing because there is no user session
      .finally(()=>setInitialLoading(false))
    },[])

  const login = (email, password) => {
    setIsLoading(true);

    userAPI.login(email, password)
      .then((user)=> {
        setUser(user);
        history.push('/home');
      })
      .catch(err => setError(err))
      .finally(()=> setIsLoading(false));
  }

  // Send the API the user's information and set the user state to the response. If error is found we set the error state.
  const signUp = (email, password, confirmPassword, firstName, lastName, phoneNumber, dob) => {
    setIsLoading(true);

    userAPI.signUp(email, password, confirmPassword, firstName, lastName, phoneNumber, dob)
      .then((user) => {
        setUser(user);
        history.push('/home');
      })
      .catch(err=>setError(err))
      .finally(()=>setIsLoading(false));
  }

  // Make a request to the API to log the user out and then set the user state to null.
  const logout = () => {
    userAPI.logout().then(()=>setUser(null));
  };


  // We are using useMemo here to avoid re-rendering the context provider when the user state changes.
  // We are going only to re-render the context provider when the user, loading or error state changes.
  const memoValue = useMemo(()=>({
    user,
    isLoading,
    error,
    login,
    signUp,
    logout
  }),[user, isLoading, error]);

  return (
    <AuthContext.Provider value={memoValue}>
      {children}
    </AuthContext.Provider>
  )  
}

// Expor the hook instead of the context iteself
export default function useAuth() {
  return useContext(AuthContext);
}
