import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components/native';
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
} from '@expo-google-fonts/poppins'
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { Register } from './src/screens/Register'; 
import theme from './src/global/styles/theme'
import { StatusBar, View } from 'react-native';
import { AppRoutes } from './src/routes/app.routes';
import { SignIn } from './src/screens/SignIn';
import { AuthContext } from './src/AuthContext';
import { AuthProvider } from './src/hooks/auth';

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_700Bold
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View
      onLayout={onLayoutRootView}
      style={{
      flex: 1
    }}
  >
    
    <ThemeProvider 
      theme={theme}
    >
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="transparent"             translucent />
          <AuthProvider>
            <AppRoutes/>
          </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
    </View>
  );
  
}


