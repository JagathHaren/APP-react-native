
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';

const SplashScreen: React.FC = () => {
  const strongOpacity = useRef(new Animated.Value(0)).current;
  const herOpacity = useRef(new Animated.Value(0)).current;
  const lineScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(strongOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(herOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.titleStrong, { opacity: strongOpacity }]}>
        STRONG
      </Animated.Text>
      <Animated.Text style={[styles.titleHer, { opacity: herOpacity }]}>
        HER
      </Animated.Text>
      <Animated.View style={[styles.line, { transform: [{ scaleX: lineScale }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStrong: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    fontStyle: 'italic',
    letterSpacing: -2,
  },
  titleHer: {
    fontSize: 72,
    fontWeight: '900',
    color: '#dc2626',
    fontStyle: 'italic',
    letterSpacing: -3,
    marginTop: -10,
  },
  line: {
    width: 100,
    height: 4,
    backgroundColor: '#dc2626',
    marginTop: 20,
  }
});

export default SplashScreen;
