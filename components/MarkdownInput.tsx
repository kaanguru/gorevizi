import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Text } from '~/components/ui/text';
import { HStack } from '~/components/ui/hstack';
import { Button, ButtonText } from '~/components/ui/button';
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
              <Icon className="text-typography-gray" as={Pencil} />
            ) : (
              <Icon className="text-typography-gray" as={ScanEye} />
            )}
          </ButtonText>
        </Button>
      </HStack>
      {showPreview ? (
        <View style={styles.previewContainer}>
          <Markdown>{notes}</Markdown>
        </View>
      ) : (
        <Textarea size="md">
          <TextareaInput
            placeholder="Notes with markdown support"
            value={notes}
            onChangeText={setNotes}
            className="min-h-[80px] py-2 "
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
    minHeight: 100,
    color: 'black',
    backgroundColor: 'white',
  },
  previewContainer: {
    // Add styles for the preview container
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    minHeight: 100,
    color: 'black',
    backgroundColor: 'white',
  },
});
