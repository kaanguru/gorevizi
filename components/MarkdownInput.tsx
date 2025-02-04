import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Textarea, TextareaInput } from './ui/textarea';
import { Icon } from './ui/icon';
import { Pencil, ScanEye } from 'lucide-react-native';

type MarkdownInputProps = {
  notes: string;
  setNotes: (notes: string) => void;
};

export default function MarkdownInput({ notes, setNotes }: Readonly<MarkdownInputProps>) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <View>
      <HStack className="items-center justify-between">
        <Text className="text-lg">Notes</Text>
        <Button size="xs" variant="outline" onPress={() => setShowPreview((prev) => !prev)}>
          <ButtonText>
            {showPreview ? (
              <Icon className="text-typography-500" as={Pencil} />
            ) : (
              <Icon className="text-typography-500" as={ScanEye} />
            )}
          </ButtonText>
        </Button>
      </HStack>
      {showPreview ? (
        <View style={styles.previewContainer}>
          <Markdown>{notes}</Markdown>
        </View>
      ) : (
        <Textarea size="md" className="bg-white">
          <TextareaInput
            placeholder="Notes with markdown support"
            value={notes}
            onChangeText={setNotes}
            className="min-h-[80px] py-2 text-typography-900"
            placeholderTextColor="#9CA3AF"
          />
        </Textarea>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    // Add styles for the input field (e.g., padding, border)
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    minHeight: 100, // Adjust as needed
  },
  previewContainer: {
    // Add styles for the preview container
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    minHeight: 100, // Adjust as needed
  },
});
