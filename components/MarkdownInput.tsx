import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { Textarea, TextareaInput } from './ui/textarea';

import { Button, ButtonText } from '~/components/ui/button';
import { HStack } from '~/components/ui/hstack';
import { Text } from '~/components/ui/text';
import { useTheme } from '~/components/ui/ThemeProvider/ThemeProvider';

type MarkdownInputProps = {
  notes: string;
  setNotes: (notes: string) => void;
};

export default function MarkdownInput({ notes, setNotes }: Readonly<MarkdownInputProps>) {
  const [showPreview, setShowPreview] = useState(false);
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    body: {
      padding: 10,
      borderColor: 'gray',
      borderWidth: 1,
      minHeight: 100,
      color: theme === 'dark' ? '#FFFAEB' : '#051824',
    },
  });
  return (
    <View>
      <HStack className="items-center justify-between">
        <Text className="text-lg">Notes</Text>
        <Button size="xs" variant="outline" onPress={() => setShowPreview((prev) => !prev)}>
          <ButtonText>
            {showPreview ? (
              <FontAwesome6
                name="pencil"
                size={18}
                color={theme === 'dark' ? '#FFFAEB' : '#051824'}
              />
            ) : (
              <Ionicons name="scan" size={20} color={theme === 'dark' ? '#FFFAEB' : '#051824'} />
            )}
          </ButtonText>
        </Button>
      </HStack>
      {showPreview ? (
        <View>
          <Markdown style={styles}>{notes}</Markdown>
        </View>
      ) : (
        <Textarea size="md" className="!text-black">
          <TextareaInput
            placeholder="Notes with markdown support"
            value={notes}
            onChangeText={setNotes}
            className="bg-background-gray min-h-[80px] py-2 !text-black"
          />
        </Textarea>
      )}
    </View>
  );
}
