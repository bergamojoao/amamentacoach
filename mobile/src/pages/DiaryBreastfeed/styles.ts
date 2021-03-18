import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { flexGrow: 1 },
  keyboardShouldPersistTaps: 'handled',
}))`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  padding: 24px;
`;

export const DateText = styled.Text`
  color: #737373;
  font-family: 'OpenSans-Regular';
  font-size: 16px;
  text-align: center;
  margin-bottom: 24px;
`;

export const ListContainer = styled.View`
  flex: 1;
  margin-bottom: 20px;
`;

export const BabyName = styled.Text`
  color: #7d5cd7;
  font-family: 'OpenSans-Bold';
  font-size: 18px;
`;

export const Registry = styled.View`
  border: 2px #c5c2cc solid;
  border-radius: 3.6px;
  padding: 15px;
  margin-bottom: 10px;
`;

export const RegistryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const RegistryTextContainer = styled.View`
  flex-direction: row;
`;

export const RegistryText = styled.Text`
  color: #7d5cd7;
  font-size: 16px;
  font-family: 'OpenSans-Regular';
`;

export const RegistryContent = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Regular';
`;
