import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {NavigationProp} from '../../types/navigation';
import {COLORS, GRADIENTS} from '../../constants/theme';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Property',
    subtitle: 'Diversity',
    image: require('../../assets/images/chart.png'),
  },
  {
    id: 2,
    title: 'Safe',
    subtitle: 'Security',
    image: require('../../assets/images/shield.png'),
  },
  {
    id: 3,
    title: 'Convenient',
    subtitle: 'Transaction',
    image: require('../../assets/images/rocket.png'),
  },
];

export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const slideAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: slideAnimation.value}],
    };
  });

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      slideAnimation.value = withSpring(-width * (currentSlide + 1));
    } else {
      navigation.navigate('WalletSetup');
    }
  };

  const renderGradientText = (text: string) => (
    <MaskedView
      maskElement={<Text style={styles.subtitle}>{text}</Text>}>
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <Text style={[styles.subtitle, {opacity: 0}]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideContainer, animatedStyle]}>
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            {renderGradientText(slide.subtitle)}
          </View>
        ))}
      </Animated.View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientButton}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  gradientText: {
    padding: 2,
    borderRadius: 5,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#8A2BE2',
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 40,
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
  gradientWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
  },
});