import { createContext, useState, useMemo, useEffect, useContext } from 'react';

import * as userAPI from '../api/userAPI';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => { // I also included general error handling here hehehe
  const [user, setUser] = useState(null);
  const [errorLogIn, setErrorLogIn] = useState(null);
  const [errorSignUp, setErrorSignUp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already has a session, if so, set the user state and finaly set the initail loading to false.
  useEffect(()=>{
    userAPI.checkIfAuthenticated()
      .then(data => setUser(data.user))
      .catch(err => {}) // Do nothing because there is no user session
    },[])

  const login = (loginCreds) => {
    setIsLoading(true);

    userAPI.login(loginCreds)
      .then((res)=> {
        if (res.status !== 'success') {
          setErrorLogIn(res.data);
          setIsLoading(false);
          return;
        }
        setUser(res.data);
      })
      .catch(err => setErrorLogIn(err))
      .finally(()=> setIsLoading(false));
  }

  // Send the API the user's information and set the user state to the response. If error is found we set the error state.
  const signUp = (signUpCreds) => {
    setIsLoading(true);
    
    userAPI.signUp(signUpCreds)
      .then((res)=> {
        if (res.status == 'fail') {
          setErrorSignUp(res.data);
        }
      })
      .catch(err => setErrorSignUp(err.data))
      .finally(()=> setIsLoading(false));  
  };

  // Make a request to the API to log the user out and then set the user state to null.
  const logout = () => {
    userAPI.logout().then(()=>setUser(null));
  };


  // We are using useMemo here to avoid re-rendering the context provider when the user state changes.
  // We are going only to re-render the context provider when the user, loading or error state changes.
  const memoValue = useMemo(()=>({
    user,
    isLoading,
    errorLogIn,
    errorSignUp,
    login,
    signUp,
    logout
  }),[user, isLoading, errorLogIn, errorSignUp]);

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
