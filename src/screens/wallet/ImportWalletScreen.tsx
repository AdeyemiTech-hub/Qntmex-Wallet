import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export const ImportWalletScreen = () => {
  const navigation = useNavigation();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleImport = () => {
    // Implement wallet import logic
    navigation.navigate('WalletHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import From Seed</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Seed Phrase"
            placeholderTextColor="#666"
            value={seedPhrase}
            onChangeText={setSeedPhrase}
            secureTextEntry={!showSeedPhrase}
          />
          <TouchableOpacity
            onPress={() => setShowSeedPhrase(!showSeedPhrase)}
            style={styles.eyeIcon}>
            <Icon
              name={showSeedPhrase ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.passwordHint}>Must be at least 8 characters</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}>
            <Icon
              name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.biometricRow}>
          <Text style={styles.biometricText}>Sign in with Face ID?</Text>
          <Switch
            value={useBiometric}
            onValueChange={setUseBiometric}
            trackColor={{false: '#333', true: '#8A2BE2'}}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.terms}>
          By proceeding, you agree to these{' '}
          <Text style={styles.termsLink}>Term and Conditions</Text>.
        </Text>

        <TouchableOpacity style={styles.importButton} onPress={handleImport}>
          <LinearGradient
            colors={['#8A2BE2', '#FF69B4', '#FFA500']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            <Text style={styles.buttonText}>Import</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  passwordHint: {
    color: '#666',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  biometricText: {
    color: '#fff',
    fontSize: 16,
  },
  terms: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 24,
  },
  termsLink: {
    color: '#8A2BE2',
    textDecorationLine: 'underline',
  },
  importButton: {
    marginTop: 'auto',
  },
  gradientButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});