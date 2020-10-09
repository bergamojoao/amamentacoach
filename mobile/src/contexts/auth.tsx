import React, { createContext, useState, useEffect, useContext } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

interface IAuthContextData {
  signed: boolean;
  token: string | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function checkDataInStorage() {
      const storageToken = await AsyncStorage.getItem('@AmamentaCoach:token');

      if (storageToken) {
        setToken(storageToken);
        api.defaults.headers.common.Authorization = storageToken;
      }
    }

    checkDataInStorage();
  });

  async function signIn(email: string, password: string) {
    const userToken = await auth.signIn(email, password);
    await AsyncStorage.setItem('@AmamentaCoach:token', userToken);
    setToken(userToken);
    api.defaults.headers.common.Authorization = userToken;
  }

  async function signOut() {
    await AsyncStorage.removeItem('@AmamentaCoach:id');
    await AsyncStorage.removeItem('@AmamentaCoach:token');
    setToken(null);
    api.defaults.headers.common.Authorization = null;
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!token,
        token,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}

export default AuthContext;
