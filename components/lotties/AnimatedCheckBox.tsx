import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface CheckBoxProps {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedCheckBox({
  height = 30,
  width = 30,
  style,
}: Readonly<CheckBoxProps>) {
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={1}
      key="checkbox"
      style={[
        {
          width: width,
          height: height,
          alignSelf: 'center',
          zIndex: 10,
        },
        style,
      ]}
      source={require('~/assets/lottie/checkbox.json')}
      resizeMode="cover"
    />
  );
}
