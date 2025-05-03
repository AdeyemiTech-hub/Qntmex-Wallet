import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

export const WalletSetupScreen = () => {
  const navigation = useNavigation();

  const handleImportWallet = () => {
    navigation.navigate('ImportWallet');
  };

  const handleCreateWallet = () => {
    navigation.navigate('CreateWallet');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/wallet.png')}
        style={styles.walletImage}
      />
      <Text style={styles.title}>Wallet Setup</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleImportWallet}>
        <View style={styles.importButton}>
          <Text style={styles.buttonText}>Import Using Seed Phrase</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateWallet}>
        <LinearGradient
          colors={['#8A2BE2', '#FF69B4', '#FFA500']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientButton}>
          <Text style={styles.buttonText}>Create a New Wallet</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  walletImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  importButton: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  gradientButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});