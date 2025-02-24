import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native';

interface TutorialItem {
  id: number;
  image: any;
  title: string;
  description: string;
}
// TODO: webp dosyaları oluştur
const tutorials: TutorialItem[] = [
  {
    id: 1,
    image: require('../../assets/tutorial1.png'),
    title: 'Tutorial 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
  },
  {
    id: 2,
    image: require('../../assets/tutorial2.png'),
    title: 'Tutorial 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
  },
  {
    id: 3,
    image: require('../../assets/tutorial2.png'),
    title: 'Tutorial 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TutorialScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashListRef = useRef<FlashList<TutorialItem>>(null);

  // Specify type for renderItem
  const renderItem = ({ item }: Readonly<{ item: TutorialItem }>) => (
    <View className="h-full items-center justify-center px-5" style={{ width: SCREEN_WIDTH }}>
      <View className="mb-5 h-72 w-72 items-center justify-center rounded-xl bg-gray-100">
        <Image source={item.image} className="h-48 w-48" contentFit="contain" />
      </View>
      <Text className="text-navy-800 mb-2.5 text-2xl font-bold">{item.title}</Text>
      <Text className="text-center text-base text-gray-600">{item.description}</Text>
    </View>
  );

  const handleContinue = () => {
    if (currentIndex < tutorials.length - 1) {
      flashListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(onboarding)/start' as Href);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <FlashList
          ref={flashListRef}
          data={tutorials}
          renderItem={renderItem}
          estimatedItemSize={SCREEN_WIDTH}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(newIndex);
          }}
        />
      </View>

      <View className="px-5 pb-5">
        <View id="paginator" className="mb-5 flex-row items-center justify-center">
          {tutorials.map((_, index) => (
            <View
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-navy-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        <Pressable className="bg-navy-800 rounded-lg px-6 py-3" onPress={handleContinue}>
          <Text className="text-center text-base font-semibold text-gray-500">
            {currentIndex === tutorials.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
