import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { enCA, ptBR } from 'date-fns/locale';
import i18n from 'i18n-js';
import { I18nManager, StatusBar } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { ThemeProvider } from 'styled-components/native';

import theme from './config/theme';
import { AuthProvider } from './contexts/auth';
import { IsFirstRunProvider } from './contexts/firstRun';
import { dateFNSSetLocale } from './lib/date-fns';
import Routes from './routes/routes';

const App: React.FC = () => {
  const [isLocalizationLoaded, setIsLocalizationLoaded] = useState(false);

  const setI18nConfig = async () => {
    const translationPaths: {
      [key: string]: { translation: object; locale: Locale };
    } = {
      pt: { translation: require('./translations/pt.json'), locale: ptBR },
      en: { translation: require('./translations/en.json'), locale: enCA },
    };

    // Caso nenhuma língua seja encontrada é utilizado português.
    const fallback = { languageTag: 'pt', isRTL: false };

    const { languageTag, isRTL } =
      RNLocalize.findBestAvailableLanguage(Object.keys(translationPaths)) ||
      fallback;

    I18nManager.forceRTL(isRTL);
    i18n.translations = {
      [languageTag]: translationPaths[languageTag].translation,
    };
    i18n.locale = languageTag;
    dateFNSSetLocale(translationPaths[languageTag].locale);
  };

  useEffect(() => {
    async function setLocale() {
      await setI18nConfig();
      RNLocalize.addEventListener('change', setI18nConfig);
      setIsLocalizationLoaded(true);
    }
    setLocale();

    return () => {
      RNLocalize.removeEventListener('change', setI18nConfig);
    };
  }, []);

  if (!isLocalizationLoaded) {
    return <StatusBar barStyle="light-content" />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <IsFirstRunProvider>
        <AuthProvider>
          <NavigationContainer>
            <ThemeProvider theme={theme}>
              <Routes />
            </ThemeProvider>
          </NavigationContainer>
        </AuthProvider>
      </IsFirstRunProvider>
    </>
  );
};

export default App;
