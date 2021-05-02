import styled from 'styled-components/native';
import { defaultTheme } from './theme';

const fontRef = 15;

export const Activity = styled.SafeAreaView`
    height: 100%;
    background-color: ${props => props.theme.tertiary};
`;

export const Header = styled.View`
    margin: 0;
    padding: 20px;
    background-color: ${props => getColor(props)};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 0;
    margin: 0;
`;

export const P = styled.Text`
    font-size: ${props => fontSize(props.size)};
    color: ${props => props.color || props.theme.text[0]};
`;
export const CenterP = styled.Text`
    font-size: ${props => fontSize(props.size)};
    color: ${props => props.color || props.theme.text[0]};
    width: 100%;
    text-align: center;
`;
export const Label = styled.Text`
    font-size: ${props => fontSize(props.size)};
    color: ${props => props.color || props.theme.text[0]};
    margin-bottom: 5px;
    margin-left: 15px
`;

export const Toolbar = styled.View`
    display: flex;
    flex-direction: row;
`;
export const ToolbarItem = styled.View`
    display: flex;
    justify-content: center;
`;
export const Card = styled.View`
    padding: 20px;
    margin-bottom: 10px;
    background-color: ${props => props.theme.secondary};
    border-radius: 5px;
`;
export const CardP = styled.Text`
    font-size: ${fontSize(1)};
    color: ${props => props.theme.text[0]};
`;

export const DefaultButton = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    background-color: ${props => getColor(props)};
    border-radius: ${props => getRounded(props)};
`;

export const RoundFlotButton = styled.TouchableOpacity`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 35px;
    background-color: ${props => getColor(props)};
`;

export const DefaultModal = styled.View`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

export const MediumModalBox = styled.View`
    width: 80%;
    height: 60%;
    margin-top: -50px;
    background-color: ${defaultTheme.greys[0]};
    border-radius: ${props => getRounded(props)};
    overflow: hidden;
`;
export const ScrollModal = styled.ScrollView`
    padding: 10px;
`;
export const ItemListModal = styled.TouchableOpacity`
    padding: 15px;
    margin-bottom: 5px;
    background-color: ${props => getColor(props)};
    border-radius: ${props => getRounded(props)};

`;

function fontSize(value) {
    if (value) {
        let n = Number(value);
        return Number(n * fontRef) + 'px';
    } else {
        return fontRef + 'px';
    }
}
function getColor(props) {
    if (props.color) {
        if (props.theme[props.color]){
            return props.theme[props.color];
        } else {
            return props.color;
        }
    } else {
        return props.theme.primary;
    }
}

function getRounded(props) {
    if (props.rounded) {
        if (props.rounded === 'soft') {
            return '5px';
        } else if (props.rounded === 'medium') {
            return '10px';
        } else if (props.rounded === 'hard') {
            return '15px';
        } else if (props.rounded === 'full') {
            return '100000px';
        }
    } else {
        return '0';
    }
}
