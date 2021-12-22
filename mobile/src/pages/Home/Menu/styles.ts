import styled from 'styled-components/native';

import { ManjariBold, OpenSansRegular } from 'lib/sharedStyles';

interface OptionProps {
  selected: boolean;
}

export const Header = styled.View`
  width: 100%;
  height: 274px;
`;

export const ModalOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

export const TextModal = styled(OpenSansRegular)`
  text-align: left;
`;

export const OuterCircle = styled.View<OptionProps>`
  border: 1.4px solid
    ${({ theme, selected }) => (selected ? theme.babyPurple : theme.brightGrey)};
  background-color: transparent;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const InnerCircle = styled.View<OptionProps>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.babyPurple : 'transparent'};
  width: 10px;
  height: 10px;
  border-radius: 5px;
`;

export const LocationContainer = styled.View`
  margin-top: 10px;
`;

export const HeaderBackground = styled.View`
  background-color: ${props => props.theme.babyPink};
  align-items: center;
  width: 100%;
  height: 70%;
`;

export const HeaderText = styled(ManjariBold)`
  font-size: 24px;
  color: ${props => props.theme.white};
  margin-top: 30px;
`;

export const BannerImage = styled.ImageBackground`
  margin: -124px 24px 0 24px;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

export const HUButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.accent};
  height: 40px;
  width: 100%;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
`;

export const HUButtonText = styled(ManjariBold)`
  font-size: 14px;
  color: ${props => props.theme.white};
`;

export const ContentContainer = styled.View`
  flex: 1;
  margin: 80px 24px 0 24px;
`;

export const ContentHeader = styled(ManjariBold)`
  font-size: 20px;
  margin-bottom: 20px;
`;
