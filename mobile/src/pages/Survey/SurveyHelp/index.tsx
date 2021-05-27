import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import RemoteForm from '../../../components/RemoteForm';
import createGenericRemoteFormPage from '../../../components/GenericRemoteFormPage';
import theme from '../../../config/theme';

const SurveyHelp: React.FC = () => {
  const navigation = useNavigation();

  // Marca o formulário como enviado no dia.
  async function setFormSent() {
    await AsyncStorage.setItem(
      '@AmamentaCoach:DiarySurveyHelpLastDate',
      new Date().toISOString(),
    );
  }

  async function onFormEnd() {
    await setFormSent();
    navigation.navigate('Survey');
  }

  return (
    <RemoteForm
      title="Sobre ajuda"
      color={theme.babyBlue}
      category={9}
      Page={createGenericRemoteFormPage(onFormEnd)}
      onFeedbackAccepted={setFormSent}
    />
  );
};

export default SurveyHelp;
