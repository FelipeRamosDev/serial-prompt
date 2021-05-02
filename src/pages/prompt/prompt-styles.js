import styled from 'styled-components';

export const Prompt = styled.ScrollView`
    padding: 10px;
    background-color: #000;
    border-radius: 10px;
    width: 96%;
    margin: 2% auto;
`;

export const PromptP = styled.Text`
    color: ${props => props.theme.contrast};
    font-size: 18px;
`;

export const ContainerPrompt = styled.View`
    padding: 10px;
`;

export const PromptInput = styled.TextInput`
    color: ${props => props.theme.contrast};
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 20px;
    font-size: 18px;
`;
