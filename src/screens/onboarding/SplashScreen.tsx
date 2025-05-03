import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#FF69B4', '#FFA500']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientText}>
        <Text style={styles.title}>QNTMEX</Text>
      </LinearGradient>
      <Text style={styles.subtitle}>WALLET</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientText: {
    padding: 2,
    borderRadius: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 8,
    fontWeight: '500',
  },
});