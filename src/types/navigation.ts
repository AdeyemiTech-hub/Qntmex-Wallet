import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  WalletSetup: undefined;
  ImportWallet: undefined;
  CreateWallet: undefined;
  WalletHome: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;