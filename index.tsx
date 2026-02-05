
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// In a real React Native environment, the entry point is usually handled by the bundler
// Here we represent the root component initialization.
export default function Main() {
  return <App />;
}

AppRegistry.registerComponent('StrongHer', () => Main);
