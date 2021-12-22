import styled from 'styled-components/native';

import { OpenSansRegular } from 'lib/sharedStyles';

export const LabelText = styled(OpenSansRegular)`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const TextInput = styled.TextInput`
  font-family: 'OpenSans-Regular';
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.black};
  border-radius: 3.6px;
`;
