import 'yup-phone';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import i18n from 'i18n-js';
import React from 'react';
import { getCountry } from 'react-native-localize';
import * as Yup from 'yup';

import FormDateInput from 'components/FormDateInput';
import FormPickerInput from 'components/FormPickerInput';
import FormRadioGroupInput from 'components/FormRadioGroup';
import FormTextInput from 'components/FormTextInput';
import MainButton from 'components/MainButton';
import PaddedScrollView from 'components/PaddedScrollView';
import SecondaryButton from 'components/SecondaryButton';
import { Center, Flex, Row, Spacer } from 'lib/sharedStyles';
import { getCountryStates } from 'utils/localize';

import type { AuthRouteProp, AuthStackProps } from 'routes/auth';

import {
  HeaderText,
  QuestionContainer,
  StatePicker,
  StateQuestion,
  SubmitButtonContainer,
} from './styles';

interface FormValues {
  birthDate?: Date;
  birthday?: Date;
  birthLocation: string;
  birthWeeks: string;
  city: string;
  currentGestationCount: string;
  hasPartner?: boolean;
  name: string;
  origin: string;
  phone: string;
  possibleBirthDate?: Date;
  socialMedia: string;
  state: string;
  userType: string;
  weeksPregnant: string;
}

const MotherForm: React.FC = () => {
  const navigation = useNavigation<AuthStackProps>();
  const { email, password } = useRoute<AuthRouteProp<'MotherForm'>>().params;

  const availableStates = getCountryStates();
  const formInitialValues: FormValues = {
    birthday: undefined,
    currentGestationCount: '',
    birthLocation: '',
    name: '',
    hasPartner: undefined,
    phone: '',
    userType: '',
    origin: '',
    socialMedia: '',
    weeksPregnant: '',
    possibleBirthDate: undefined,
    birthWeeks: '',
    birthDate: undefined,
    city: '',
    state: '',
  };

  const isMotherStringYupSchema = Yup.string().when('userType', {
    is: i18n.t('MotherFormPage.UserTypeOptions.Mother'),
    then: Yup.string().required(i18n.t('Yup.Required')),
    otherwise: Yup.string(),
  });
  const formSchema = Yup.object({
    name: Yup.string().required(i18n.t('Yup.Required')),
    birthday: Yup.date().required(i18n.t('Yup.Required')),
    phone: Yup.string()
      .required(i18n.t('Yup.Required'))
      .phone(getCountry(), true, i18n.t('Yup.Phone')),
    userType: Yup.string().required(i18n.t('Yup.Required')),
    origin: Yup.string().required(i18n.t('Yup.Required')),
    socialMedia: Yup.string().when('origin', {
      is: i18n.t('MotherFormPage.OriginOptions.SocialMedia'),
      then: Yup.string().required(i18n.t('Yup.Required')),
      otherwise: Yup.string(),
    }),
    // Caso seja gestante.
    weeksPregnant: Yup.number()
      .min(0, i18n.t('Yup.MinError', { num: 0 }))
      .when('userType', {
        is: i18n.t('MotherFormPage.UserTypeOptions.Pregnant'),
        then: Yup.number().required(i18n.t('Yup.Required')),
        otherwise: Yup.number(),
      }),
    possibleBirthDate: Yup.date().when('userType', {
      is: i18n.t('MotherFormPage.UserTypeOptions.Pregnant'),
      then: Yup.date().required(i18n.t('Yup.Required')),
      otherwise: Yup.date(),
    }),
    // Caso seja mãe de prematuro.
    birthWeeks: Yup.string().when('userType', {
      is: i18n.t('MotherFormPage.UserTypeOptions.Mother'),
      then: Yup.string().required(i18n.t('Yup.Required')),
      otherwise: Yup.string(),
    }),
    birthDate: isMotherStringYupSchema,
    city: isMotherStringYupSchema,
    currentGestationCount: Yup.number().when('userType', {
      is: i18n.t('MotherFormPage.UserTypeOptions.Mother'),
      then: Yup.number()
        .integer(i18n.t('Yup.MustBeIntegerError'))
        .typeError(i18n.t('Yup.MustBeIntegerError'))
        .min(1, i18n.t('Yup.MinEqualError', { num: 1 }))
        .required(i18n.t('Yup.Required')),
      otherwise: Yup.number(),
    }),
    hasPartner: Yup.boolean().when('userType', {
      is: i18n.t('MotherFormPage.UserTypeOptions.Mother'),
      then: Yup.boolean().required(i18n.t('Yup.Required')),
      otherwise: Yup.boolean(),
    }),
    state: isMotherStringYupSchema,
  }).required();

  // Avança para a próxima página passando as informações do usuário.
  function handleFormSubmit(formValues: FormValues): void {
    const motherInfo = {
      ...formValues,
      birthday: formValues.birthday!.toISOString(),
      possibleBirthDate: formValues.possibleBirthDate
        ? formValues.possibleBirthDate.toISOString()
        : null,
      birthDate: formValues.birthDate
        ? formValues.birthDate.toISOString()
        : null,
      currentGestationCount: Number(formValues.currentGestationCount),
      hasPartner: formValues.hasPartner!,
      email,
      password,
    };
    if (
      motherInfo.userType === i18n.t('MotherFormPage.UserTypeOptions.Mother')
    ) {
      navigation.navigate('BabyForm', { motherInfo });
    } else {
      navigation.navigate('AcceptTermsOfService', {
        motherInfo,
        babiesInfo: [],
      });
    }
  }

  return (
    <PaddedScrollView>
      <HeaderText>
        {i18n.t('Auth.SignUpStep', { current: '2', max: '4' })}
      </HeaderText>
      <Formik
        initialValues={formInitialValues}
        validateOnChange={false}
        validationSchema={formSchema}
        onSubmit={values => handleFormSubmit(values)}>
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          dirty,
          errors,
          values,
        }) => (
          <Flex>
            <QuestionContainer>
              <FormTextInput
                error={errors.name}
                label={i18n.t('MotherFormPage.Name')}
                placeholder={i18n.t('Name')}
                value={values.name}
                onChangeText={handleChange('name')}
              />
            </QuestionContainer>

            <QuestionContainer>
              <FormTextInput
                error={errors.phone}
                keyboardType="phone-pad"
                label={i18n.t('MotherFormPage.Phone')}
                placeholder={i18n.t('MotherFormPage.Phone')}
                value={values.phone}
                onChangeText={handleChange('phone')}
              />
            </QuestionContainer>

            <QuestionContainer>
              <FormDateInput
                error={errors.birthday}
                label={i18n.t('MotherFormPage.Birthday')}
                maxDate={new Date()}
                placeholder={i18n.t('MotherFormPage.BirthdayPlaceholder')}
                onChange={date => setFieldValue('birthday', date)}
              />
            </QuestionContainer>

            <QuestionContainer>
              <FormPickerInput
                error={errors.origin}
                label={i18n.t('MotherFormPage.Origin')}
                options={[
                  i18n.t('MotherFormPage.OriginOptions.HU'),
                  i18n.t('MotherFormPage.OriginOptions.HMDI'),
                  i18n.t('MotherFormPage.OriginOptions.AHC'),
                  i18n.t('MotherFormPage.OriginOptions.SocialMedia'),
                ]}
                onChange={handleChange('origin')}
              />
            </QuestionContainer>

            {values.origin ===
              i18n.t('MotherFormPage.OriginOptions.SocialMedia') && (
              <QuestionContainer>
                <FormPickerInput
                  error={errors.socialMedia}
                  label={i18n.t('MotherFormPage.SocialMedia')}
                  options={[
                    'Facebook',
                    'Instagram',
                    'Whatsapp',
                    i18n.t('MotherFormPage.SocialMediaOptions.TVOrRadio'),
                    'Folder',
                    i18n.t('Other'),
                  ]}
                  onChange={handleChange('socialMedia')}
                />
              </QuestionContainer>
            )}

            <FormPickerInput
              error={errors.userType}
              label={i18n.t('MotherFormPage.UserType')}
              options={[
                i18n.t('MotherFormPage.UserTypeOptions.Pregnant'),
                i18n.t('MotherFormPage.UserTypeOptions.Mother'),
                i18n.t('MotherFormPage.UserTypeOptions.HealthcareWorker'),
                i18n.t('Other'),
              ]}
              onChange={newValue => {
                setFieldValue('userType', newValue);
                if (newValue !== values.userType) {
                  setFieldValue('hasPartner', '');
                  setFieldValue('location', '');
                  setFieldValue('currentGestationCount', '');
                  setFieldValue('weeksPregnant', '');
                  setFieldValue('possibleBirthDate', '');
                }
              }}
            />

            {values.userType ===
              i18n.t('MotherFormPage.UserTypeOptions.Mother') && (
              <>
                <QuestionContainer>
                  <FormTextInput
                    error={errors.birthWeeks}
                    keyboardType="numeric"
                    label={i18n.t('MotherFormPage.BirthWeeks')}
                    placeholder={i18n.t('Week', { count: 2 })}
                    value={values.birthWeeks}
                    onChangeText={handleChange('birthWeeks')}
                  />
                </QuestionContainer>

                <QuestionContainer>
                  <FormDateInput
                    error={errors.birthDate}
                    label={i18n.t('MotherFormPage.BirthDate')}
                    maxDate={new Date()}
                    placeholder={i18n.t('MotherFormPage.Placeholder.BirthDate')}
                    onChange={date => setFieldValue('birthDate', date)}
                  />
                </QuestionContainer>

                <QuestionContainer>
                  <StateQuestion>
                    {i18n.t('MotherFormPage.BirthCityStateHeader')}
                  </StateQuestion>
                  <Row>
                    <Flex>
                      <FormTextInput
                        error={errors.city}
                        label={i18n.t('City')}
                        placeholder={i18n.t('City')}
                        onChangeText={handleChange('city')}
                      />
                    </Flex>
                    {availableStates.length > 0 && (
                      <>
                        <Spacer width={4} />
                        <Flex>
                          <StatePicker
                            error={errors.state}
                            label={i18n.t('State')}
                            options={availableStates}
                            onChange={handleChange('state')}
                          />
                        </Flex>
                      </>
                    )}
                  </Row>
                </QuestionContainer>

                <FormRadioGroupInput
                  error={errors.hasPartner}
                  label={i18n.t('MotherFormPage.Partner')}
                  options={[i18n.t('Yes'), i18n.t('No')]}
                  onChange={fieldValues => {
                    let value;
                    if (fieldValues[0]) {
                      value = fieldValues[0] === i18n.t('Yes');
                    }
                    setFieldValue('hasPartner', value);
                  }}
                />
                <QuestionContainer>
                  <FormTextInput
                    error={errors.currentGestationCount}
                    keyboardType="numeric"
                    label={i18n.t('MotherFormPage.CurrentGestationCount')}
                    placeholder={i18n.t('MotherFormPage.CountPlaceholder')}
                    value={values.currentGestationCount}
                    onChangeText={handleChange('currentGestationCount')}
                  />
                </QuestionContainer>
              </>
            )}

            {values.userType ===
              i18n.t('MotherFormPage.UserTypeOptions.Pregnant') && (
              <>
                <FormTextInput
                  error={errors.weeksPregnant}
                  keyboardType="numeric"
                  label={i18n.t('MotherFormPage.WeeksPregnant')}
                  placeholder={i18n.t('Week', { count: 2 })}
                  value={values.weeksPregnant}
                  onChangeText={handleChange('weeksPregnant')}
                />

                <FormDateInput
                  error={errors.possibleBirthDate}
                  label={i18n.t('MotherFormPage.PossibleBirthDate')}
                  minDate={new Date()}
                  placeholder={i18n.t('Date')}
                  onChange={date => setFieldValue('possibleBirthDate', date)}
                />
              </>
            )}

            <SubmitButtonContainer>
              <Flex>
                <SecondaryButton
                  text={i18n.t('GoBack')}
                  onPress={() => navigation.goBack()}
                />
              </Flex>
              <Spacer width={4} />
              <Flex>
                <MainButton
                  disabled={!dirty}
                  text={i18n.t('Next')}
                  onPress={handleSubmit}
                />
              </Flex>
            </SubmitButtonContainer>
          </Flex>
        )}
      </Formik>
    </PaddedScrollView>
  );
};

export default MotherForm;
