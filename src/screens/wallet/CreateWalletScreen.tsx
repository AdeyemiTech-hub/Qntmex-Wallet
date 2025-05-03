import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export const CreateWalletScreen = () => {
  const navigation = useNavigation();
  const [seedPhrase] = useState(
    'abandon ability able about above absent absorb abstract absurd abuse access accident'
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // In a real app, you would verify the user has backed up the seed phrase
    navigation.navigate('WalletHome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Wallet</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Your Seed Phrase</Text>
        
        <Text style={styles.description}>
          Write down or copy these words in the right order and save them
          somewhere safe.
        </Text>

        <View style={styles.seedPhraseContainer}>
          {seedPhrase.split(' ').map((word, index) => (
            <View key={index} style={styles.wordContainer}>
              <Text style={styles.wordNumber}>{index + 1}</Text>
              <Text style={styles.word}>{word}</Text>
            </View>
          ))}
        </View>

        <View style={styles.warningContainer}>
          <Icon name="warning-outline" size={20} color="#FFA500" />
          <Text style={styles.warningText}>
            Never share your seed phrase. Anyone with these words can access your
            wallet.
          </Text>
        </View>

        <TouchableOpacity style={styles.copyButton}>
          <Text style={styles.copyButtonText}>
            <Icon name="copy-outline" size={16} color="#8A2BE2" /> Copy to
            clipboard
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <LinearGradient
            colors={['#8A2BE2', '#FF69B4', '#FFA500']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}>
            <Text style={styles.buttonText}>I've Saved My Seed Phrase</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  seedPhraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  wordNumber: {
    color: '#666',
    marginRight: 8,
    fontSize: 14,
  },
  word: {
    color: '#fff',
    fontSize: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  warningText: {
    color: '#FFA500',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  copyButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  copyButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
  footer: {
    padding: 20,
  },
  continueButton: {
    marginBottom: 20,
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