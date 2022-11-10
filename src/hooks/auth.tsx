import React, { useContext } from "react";
import { createContext, ReactNode } from "react";

export const AuthContext = createContext([]);

interface AuthProviderProps{
  children: ReactNode;
}

interface User{
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IauthContextData {
  user: string;
}

function AuthProvider({children}:AuthProviderProps){

  const user = {
    id: '213',
    name: 'javael',
    email: 'javael@java.java.com'
  }

  return(
    <AuthContext.Provider value={[]}>
      {children}
    </AuthContext.Provider>
  )
}


function useAuth(){
  const context = useContext(AuthContext);

  return context
}


export {AuthProvider,useAuth}

