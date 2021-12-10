import i18n from 'i18n-js';
import { useState } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import config from 'react-native-config';
import ImagePicker from 'react-native-image-picker';

import ImageWrapper from 'components/ImageWrapper';
import MainButton from 'components/MainButton';
import Modal from 'components/Modal';
import SecondaryButton from 'components/SecondaryButton';
import theme from 'config/theme';
import { useAuth } from 'contexts/auth';
import { Flex, Center } from 'lib/sharedStyles';

import type { ImageWrapperSourcePropType } from 'components/ImageWrapper';
import type { ImagePickerResponse } from 'react-native-image-picker';

import {
  ScrollView,
  SelectButtonContainer,
  SelectedImage,
  SubmitButtonContainer,
  Text,
} from './styles';

interface UploadPhotoScreenProps {
  // Alvo correspondente a imagem que o usuário selecionou.
  target: 'mother' | 'baby' | 'father';
  // Imagem utilizada quando o usuário não fez o upload de nenhuma imagem do alvo.
  imagePlaceholder: ImageWrapperSourcePropType;
  // Texto de apresentação da página.
  textPlaceholder: string;
  // Texto exibido quando a imagem é enviada com sucesso.
  modalSuccessText?: string;
  // Função utilizada para fazer o upload da imagem selecionada pelo usuário.
  // Retorna o endereço da imagem no servidor.
  uploadFunction: (photo: ImagePickerResponse) => Promise<string | null>;
}

const UploadPhotoScreen: React.FC<UploadPhotoScreenProps> = ({
  target,
  imagePlaceholder,
  textPlaceholder,
  modalSuccessText = i18n.t('UploadPhotoScreen.ModalSuccessText'),
  uploadFunction,
}) => {
  const { width } = Dimensions.get('window');
  const { motherInfo, updateMotherInfo } = useAuth();

  const [photo, setPhoto] = useState<ImagePickerResponse | null>(null);
  const [isSendingForm, setIsSendingForm] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [submitModalMessage, setSubmitModalMessage] = useState('');

  // Envia a foto que o usuário selecionou e atualiza as informações locais da mãe.
  async function handleSubmitNewPhoto(): Promise<void> {
    if (photo) {
      setIsSendingForm(true);
      const filename = await uploadFunction(photo);
      if (filename) {
        // Atualiza o endereço da imagem do alvo (bebê/mãe/pai) nas informações da mãe.
        await updateMotherInfo({
          ...motherInfo,
          images: { ...motherInfo.images, [target]: filename },
        });
        setPhoto(null);
        setSubmitModalMessage(modalSuccessText);
      } else {
        setSubmitModalMessage(i18n.t('UploadPhotoScreen.ErrorModalText'));
      }
      setIsSendingForm(false);
    }
  }

  // Abre a galeria do usuário.
  function handleSelectPhoto(): void {
    ImagePicker.launchImageLibrary({ noData: true }, response => {
      if (response.uri) {
        setPhoto(response);
      }
    });
  }

  return (
    <>
      <Modal
        content={submitModalMessage}
        visible={!!submitModalMessage}
        options={[
          {
            text: i18n.t('Close'),
            onPress: () => setSubmitModalMessage(''),
            isBold: true,
          },
        ]}
      />
      <ScrollView>
        <Center>
          {/* Usuário já fez o upload de uma foto e não tem nenhuma foto selecionada atualmente*/}
          {!photo && motherInfo.images[target] && (
            <>
              <SelectedImage
                source={{
                  uri: `${config.API_URL}/uploads/${motherInfo.images[target]}`,
                }}
                width={width}
                onLoadEnd={() => setIsLoadingImage(false)}
                resizeMode="contain"
                isVisible={!isLoadingImage}
              />
              {isLoadingImage && (
                <ActivityIndicator
                  size="large"
                  color={theme.primary}
                  animating={isLoadingImage}
                />
              )}
            </>
          )}
          {/* Usuário selecionou uma foto da galeria */}
          {photo && (
            <SelectedImage
              source={{ uri: photo.uri }}
              width={width}
              resizeMode="contain"
            />
          )}
          {/* Usuário ainda não enviou uma foto e não selecionou nenhuma para ser enviada */}
          {!photo && !motherInfo.images[target] && (
            <>
              <ImageWrapper
                source={imagePlaceholder}
                resizeMode="contain"
                height={250}
                width={250}
              />
              <Text>{textPlaceholder}</Text>
            </>
          )}
        </Center>
        <SubmitButtonContainer>
          <SelectButtonContainer>
            <SecondaryButton
              onPress={handleSelectPhoto}
              disabled={isSendingForm}
              text={i18n.t('Actions.SelectPicture')}
            />
          </SelectButtonContainer>
          <Flex>
            <MainButton
              onPress={handleSubmitNewPhoto}
              disabled={!photo || isSendingForm}
              text={
                isSendingForm
                  ? i18n.t('Status.Sending')
                  : i18n.t('Actions.Send')
              }
            />
          </Flex>
        </SubmitButtonContainer>
      </ScrollView>
    </>
  );
};

export default UploadPhotoScreen;
