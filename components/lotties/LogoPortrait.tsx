import LottieView from 'lottie-react-native';

export default function LogoPortrait() {
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={0.5}
      style={{
        width: 199,
        height: 530,
        alignSelf: 'center',
        zIndex: 10,
      }}
      source={require('~/assets/lottie/logo/logo-c-p.json')}
      resizeMode="cover"
    />
  );
}
