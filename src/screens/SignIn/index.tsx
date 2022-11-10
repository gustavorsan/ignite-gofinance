import React from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocial } from "../../components/SignInSocial";

import{
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SignIn(){
  return(
    <Container>
      <Header>
          <TitleWrapper>
            <LogoSvg
              width={RFValue(120)}
              height={RFValue(68)}
            />
            <Title>
              Controle sua finanças{'\n'}
              de forma simples{'\n'}
            </Title>
          </TitleWrapper>

          <SignInTitle>
              Faça seu login
          </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocial
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={()=> console.log('go')}
          />
          <SignInSocial
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={()=> console.log('go')}
          />


        </FooterWrapper>
      </Footer>
    </Container>
  )
}