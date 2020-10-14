import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './contexts/auth';
import { IsFirstRunProvider } from './contexts/firstRun';
import Routes from './routes/index';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <AuthProvider>
          <IsFirstRunProvider>
            <Routes />
          </IsFirstRunProvider>
        </AuthProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
