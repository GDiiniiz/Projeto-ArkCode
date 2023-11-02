import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

export default function GestureHandlerRootViewWrapper({ children }) {
  return <GestureHandlerRootView>{children}</GestureHandlerRootView>;
}
