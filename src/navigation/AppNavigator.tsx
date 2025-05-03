import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen} from '../screens/onboarding/SplashScreen';
import {OnboardingScreen} from '../screens/onboarding/OnboardingScreen';
import {WalletSetupScreen} from '../screens/wallet/WalletSetupScreen';
import {ImportWalletScreen} from '../screens/wallet/ImportWalletScreen';
import {WalletHomeScreen} from '../screens/wallet/WalletHomeScreen';
import {CreateWalletScreen} from '../screens/wallet/CreateWalletScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="WalletSetup" component={WalletSetupScreen} />
        <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
        <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
        <Stack.Screen name="WalletHome" component={WalletHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};