import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createContext, useContext, useEffect, useState } from 'react';
import OneSignal from 'react-native-onesignal';

import api from 'services/api';
import { LoginStatus, signIn as authSignIn } from 'services/signIn';
import { BirthLocation, getMotherInfo, isMotherInfo } from 'services/user';
import initPushNotifications from 'utils/notifications';

import type { MotherInfo } from 'services/user';

interface AuthContextData {
  isSigned: boolean;
  motherInfo: MotherInfo;
  refreshMotherInfo: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<LoginStatus>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const defaultMotherInfo: MotherInfo = {
  birthday: new Date(),
  birthLocation: BirthLocation.MATERNITY,
  email: '',
  name: '',
  hasPartner: false,
  babies: [],
  babiesBirthLocations: {
    AC: false,
    UCI: false,
    UCIN: false,
    UTI: false,
  },
  images: {
    mother: null,
    baby: null,
    father: null,
  },
};

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [motherInfo, setMotherInfo] = useState<MotherInfo>(defaultMotherInfo);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Verifica se os dados da mãe já estão salvos no dispositivo.
  async function loadMotherInfoFromStorage(): Promise<MotherInfo | null> {
    const storageMotherInfo = await AsyncStorage.getItem(
      '@AmamentaCoach:motherInfo',
    );
    if (!storageMotherInfo) {
      return null;
    }
    const savedMotherInfo = JSON.parse(storageMotherInfo);
    // Verifica se os dados salvos possuem todos os campos necessários.
    if (!isMotherInfo(savedMotherInfo)) {
      await AsyncStorage.removeItem('@AmamentaCoach:motherInfo');
      return null;
    }
    return savedMotherInfo;
  }

  // Carrega os dados da mãe.
  async function loadMotherInfo(): Promise<boolean> {
    let info = await loadMotherInfoFromStorage();
    // Não existe dados salvos, consulta a API.
    if (!info) {
      const apiMotherInfo = await getMotherInfo();
      if (!apiMotherInfo) {
        return false;
      }
      info = apiMotherInfo;
      await AsyncStorage.setItem(
        '@AmamentaCoach:motherInfo',
        JSON.stringify(apiMotherInfo),
      );
    }
    setMotherInfo(info);
    return true;
  }

  async function refreshMotherInfo(): Promise<boolean> {
    await AsyncStorage.removeItem('@AmamentaCoach:motherInfo');
    return loadMotherInfo();
  }

  async function signIn(email: string, password: string): Promise<LoginStatus> {
    const { token: newToken, status } = await authSignIn(email, password);
    if (status === LoginStatus.Success) {
      api.defaults.headers.common.Authorization = newToken;
      const motherInfoStatus = await loadMotherInfo();
      // Não foi possível carregar os dados da mãe.
      if (!motherInfoStatus) {
        api.defaults.headers.common.Authorization = null;
        return LoginStatus.FailedToConnect;
      }

      await initPushNotifications(navigation);
      await AsyncStorage.setItem('@AmamentaCoach:token', newToken);
      setToken(newToken);
    }
    return status;
  }

  async function signOut(): Promise<void> {
    OneSignal.disablePush(true);

    await AsyncStorage.removeItem('@AmamentaCoach:motherInfo');
    setMotherInfo(defaultMotherInfo);

    await AsyncStorage.removeItem('@AmamentaCoach:token');
    api.defaults.headers.common.Authorization = null;
    setToken(null);
  }

  useEffect(() => {
    // Carrega o token de identificação e os dados da mãe.
    async function loadLoginDataInStorage(): Promise<void> {
      const storageToken = await AsyncStorage.getItem('@AmamentaCoach:token');
      if (storageToken) {
        api.defaults.headers.common.Authorization = storageToken;
        const motherInfoStatus = await loadMotherInfo();
        if (motherInfoStatus) {
          setToken(storageToken);
        } else {
          // Os dados da mãe não estão armazenados no dispositivo e não foi possível consultar a
          // API.
          await AsyncStorage.removeItem('@AmamentaCoach:token');
          api.defaults.headers.common.Authorization = null;
        }
      }
      setIsLoading(false);
    }

    OneSignal.setAppId('8b92a77f-f327-48be-b2c2-d938aad5a0ab');
    loadLoginDataInStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSigned: !!token,
        motherInfo,
        refreshMotherInfo,
        signIn,
        signOut,
      }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
