import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface LogoPortraitProps {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export default function LogoPortrait({
  height = 530,
  width = 199,
  style,
}: Readonly<LogoPortraitProps>) {
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={0.5}
      style={[
        {
          width: width,
          height: height,
          alignSelf: 'center',
          zIndex: 10,
        },
        style,
      ]}
      source={require('~/assets/lottie/logo/logo-c-p.json')}
      resizeMode="cover"
    />
  );
}
