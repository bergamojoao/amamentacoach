import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Formik, FormikErrors } from 'formik';
import * as Yup from 'yup';

import { signUpBaby, signIn as getMotherToken } from '../../services/auth';
import MainButton from '../../components/MainButton';
import SecondaryButton from '../../components/SecondaryButton';
import FormRadioGroupInput from '../../components/FormRadioGroup';
import FormTextInput from '../../components/FormTextInput';
import FormDateInput from '../../components/FormDateInput';
import FormPickerInput from '../../components/FormPickerInput';

import {
  Container,
  ScrollView,
  Header,
  HeaderText,
  HeaderSubText,
  FormContainer,
  SubOptionsContainer,
  FirstSubOptionContainer,
  SecondSubOptionContainer,
  GestationWeeksContainer,
  GestationDaysContainer,
  ApgarTextContainer,
  ApgarText,
  SubmitButtonContainer,
} from './styles';
import { useAuth } from '../../contexts/auth';

interface IBaby {
  id: number;
  name: string;
  birthday: string;
  weight: string;
  birthType: string;
  difficulties: string;
  gestationWeeks: string;
  gestationDays: string;
  apgar1: string;
  apgar2: string;
  birthLocation: string;
}
interface IFormValues {
  numberOfBabies: string;
  babies: IBaby[];
}

type IScreenParams = {
  BabyForm: {
    email: string;
    password: string;
  };
};

const BabyForm: React.FC = () => {
  const { signIn } = useAuth();
  const [isSendingForm, setIsSendingForm] = useState(false);
  const [babyCount, setBabyCount] = useState(0);

  const navigation = useNavigation();
  const { email, password } = useRoute<
    RouteProp<IScreenParams, 'BabyForm'>
  >().params;

  const BabyFormSchema: Yup.ObjectSchema<IFormValues> = Yup.object({
    numberOfBabies: Yup.string()
      .matches(new RegExp('^\\d+$'), 'Deve ser um número positivo')
      .required('Campo obrigatório'),
    babies: Yup.array()
      .of(
        Yup.object({
          id: Yup.number(),
          name: Yup.string().required('Campo obrigatório'),
          birthday: Yup.string().required('Campo obrigatório'),
          weight: Yup.string()
            .matches(new RegExp('^\\d+$'), 'Deve ser um número positivo')
            .required('Campo obrigatório'),
          birthType: Yup.string().required('Campo obrigatório'),
          difficulties: Yup.string().required('Campo obrigatório'),
          gestationWeeks: Yup.string().required('Campo obrigatório'),
          gestationDays: Yup.string().required('Campo obrigatório'),
          apgar1: Yup.string()
            .matches(new RegExp('^\\d+$'), 'Deve ser um número positivo')
            .required('Campo obrigatório'),
          apgar2: Yup.string()
            .matches(new RegExp('^\\d+$'), 'Deve ser um número positivo')
            .required('Campo obrigatório'),
          birthLocation: Yup.string().required('Campo obrigatório'),
        }).required(),
      )
      .min(1, 'Pelo menos um bebê deve ser cadastrado!')
      .required(),
  }).required();

  // Retorna um novo objeto Baby com um id especificado.
  function newBaby(babyId: number): IBaby {
    return {
      id: babyId,
      name: '',
      birthday: '',
      weight: '',
      birthType: '',
      difficulties: '',
      gestationWeeks: '',
      gestationDays: '',
      apgar1: '',
      apgar2: '',
      birthLocation: '',
    };
  }

  // Retorna a mensagem de erro um bebê caso exista.
  function getBabyError(
    errors: FormikErrors<IFormValues>,
    index: number,
    field: string,
  ) {
    if (errors?.babies && errors?.babies[index]) {
      return (errors.babies[index] as { [key: string]: any })[field];
    }
    return '';
  }

  // Adiciona ou remove um bebê de acordo com a entrada do usuário.
  function handleNewBaby(
    fieldValue: string,
    babies: IBaby[],
    setFieldValue: (field: string, value: any) => void,
  ) {
    // Caso o texto possua caracteres não numéricos ele é ignorado.
    if (fieldValue !== '' && !new RegExp('^\\d+$').test(fieldValue)) {
      return;
    }

    const newBabyCount = parseInt(fieldValue, 10);
    // Caso o texto não possa ser convertido para inteiro, limpa o formulário.
    if (!newBabyCount) {
      setFieldValue('numberOfBabies', '');
      setBabyCount(1);
      setFieldValue('babies', [babies[0]]);
      return;
    }
    // Limita o formulário a um máximo de 20 bebês.
    if (newBabyCount > 20) {
      return;
    }

    setFieldValue('numberOfBabies', fieldValue);
    let newBabies = [...babies];
    for (let index = 0; index < Math.abs(newBabyCount - babyCount); index++) {
      if (newBabyCount > babyCount) {
        // Caso o novo valor seja maior que o anterior é necessário criar novos objetos do tipo
        // IBaby e adiciona-los a lista existente.
        newBabies = [...newBabies, newBaby(babyCount + index + 1)];
      } else if (newBabyCount < babyCount) {
        // Caso o novo valor seja menor que o anterior é necessário remover os n últimos objetos
        // existentes.
        newBabies.pop();
      }
    }
    setFieldValue('babies', newBabies);
    setBabyCount(newBabyCount);
  }

  // Registra todos os bebês do formulário.
  async function registerNewBaby(formValue: IFormValues) {
    setIsSendingForm(true);
    const token = await getMotherToken(email, password);

    formValue.babies.forEach(async (baby) => {
      const babyInfo = {
        name: baby.name,
        birthday: baby.birthday,
        weight: parseInt(baby.weight, 10),
        birthType: baby.birthType.toLowerCase() === 'normal',
        gestationWeeks: parseInt(baby.gestationWeeks, 10),
        gestationDays: parseInt(baby.gestationDays, 10),
        apgar1: parseInt(baby.apgar1, 10),
        apgar2: parseInt(baby.apgar2, 10),
        birthLocation: baby.birthLocation,
        difficulties: baby.birthLocation,
      };
      await signUpBaby(token, babyInfo);
    });

    setIsSendingForm(false);
    await signIn(email, password);
  }

  return (
    <Container>
      <ScrollView>
        <Header>
          <HeaderText>Passo 3 de 3</HeaderText>
          <HeaderSubText>
            Você está quase lá! Por último, faremos algumas perguntas sobre seu
            bebê:
          </HeaderSubText>
        </Header>
        <Formik
          initialValues={{
            numberOfBabies: '1',
            babies: [newBaby(0)],
          }}
          validationSchema={BabyFormSchema}
          validateOnChange={false}
          onSubmit={registerNewBaby}>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            dirty,
            errors,
            values,
          }) => (
            <Container>
              <ScrollView>
                <FormContainer>
                  <FormTextInput
                    label="Número de filhos nesta gestação"
                    value={values.numberOfBabies}
                    placeholder="Insira o número de filhos"
                    keyboardType="number-pad"
                    onChangeText={(text: string) =>
                      handleNewBaby(text, values.babies, setFieldValue)
                    }
                    error={errors.numberOfBabies}
                  />

                  {values.babies.map((baby, index) => (
                    <View key={baby.id}>
                      <FormTextInput
                        label="Nome do seu bebê"
                        onChangeText={handleChange(`babies[${index}].name`)}
                        placeholder="Nome"
                        value={values.babies[index].name}
                        error={getBabyError(errors, index, 'name')}
                      />

                      <FormDateInput
                        label="Data do parto"
                        fieldName={`babies[${index}].birthday`}
                        placeholder="Insira a data do parto"
                        onChange={setFieldValue}
                        error={getBabyError(errors, index, 'birthday')}
                      />

                      <FormTextInput
                        label="Peso de nascimento"
                        value={values.babies[index].weight}
                        placeholder="Insira o peso do bebê ao nascer"
                        keyboardType="number-pad"
                        onChangeText={handleChange(`babies[${index}].weight`)}
                        error={getBabyError(errors, index, 'weight')}
                      />

                      <FormRadioGroupInput
                        label="Tipo de parto"
                        fieldName={`babies[${index}].birthType`}
                        options={['Normal', 'Cesária']}
                        onChange={setFieldValue}
                        error={getBabyError(errors, index, 'birthType')}
                      />

                      <FormRadioGroupInput
                        label="Presença de complicação pós-parto?"
                        fieldName={`babies[${index}].difficulties`}
                        options={['Sim', 'Não']}
                        onChange={setFieldValue}
                        error={getBabyError(errors, index, 'difficulties')}
                      />

                      <SubOptionsContainer>
                        <GestationWeeksContainer>
                          <FormPickerInput
                            label="Idade gestacional ao nascer"
                            fieldName={`babies[${index}].gestationWeeks`}
                            options={[
                              '36',
                              '35',
                              '34',
                              '33',
                              '32',
                              '31',
                              '30',
                              '29',
                              '28',
                              '27',
                              '26',
                              '25',
                              '24',
                            ]}
                            placeholder="Semanas"
                            onChange={setFieldValue}
                            error={getBabyError(
                              errors,
                              index,
                              'gestationWeeks',
                            )}
                          />
                        </GestationWeeksContainer>
                        <GestationDaysContainer>
                          <FormPickerInput
                            label=""
                            fieldName={`babies[${index}].gestationDays`}
                            options={['6', '5', '4', '3', '2', '1', '0']}
                            placeholder="Dias"
                            onChange={setFieldValue}
                            error={getBabyError(errors, index, 'gestationDays')}
                          />
                        </GestationDaysContainer>
                      </SubOptionsContainer>

                      <SubOptionsContainer>
                        <FirstSubOptionContainer>
                          <FormTextInput
                            label="Apgar (opcional)"
                            value={values.babies[index].apgar1}
                            placeholder=""
                            keyboardType="number-pad"
                            onChangeText={handleChange(
                              `babies[${index}].apgar1`,
                            )}
                            error={getBabyError(errors, index, 'apgar1')}
                          />
                        </FirstSubOptionContainer>
                        <ApgarTextContainer>
                          <ApgarText>e</ApgarText>
                        </ApgarTextContainer>
                        <SecondSubOptionContainer>
                          <FormTextInput
                            label=""
                            value={values.babies[index].apgar2}
                            placeholder=""
                            keyboardType="number-pad"
                            onChangeText={handleChange(
                              `babies[${index}].apgar2`,
                            )}
                            error={getBabyError(errors, index, 'apgar2')}
                          />
                        </SecondSubOptionContainer>
                      </SubOptionsContainer>

                      <FormRadioGroupInput
                        label="Ao nascer, seu bebê foi para:"
                        fieldName={`babies[${index}].birthLocation`}
                        options={[
                          'Alojamento conjunto',
                          'UCI Neonatal',
                          'UTI Neonatal',
                        ]}
                        onChange={setFieldValue}
                        error={getBabyError(errors, index, 'birthLocation')}
                      />
                    </View>
                  ))}

                  <SubmitButtonContainer>
                    <FirstSubOptionContainer>
                      <SecondaryButton
                        onPress={() => navigation.goBack()}
                        buttonText="Voltar"
                      />
                    </FirstSubOptionContainer>
                    <SecondSubOptionContainer>
                      <MainButton
                        onPress={handleSubmit}
                        disabled={!dirty || isSendingForm}
                        buttonText="Próximo"
                      />
                    </SecondSubOptionContainer>
                  </SubmitButtonContainer>
                </FormContainer>
              </ScrollView>
            </Container>
          )}
        </Formik>
      </ScrollView>
    </Container>
  );
};

export default BabyForm;
