import React, { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';

//2.
export const AuthContext = React.createContext();

//3.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};