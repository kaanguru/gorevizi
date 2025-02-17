import React from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { FormInputProps } from '@/types';
import { VStack } from './ui/vstack';
import MarkdownInput from './MarkdownInput';

export function FormInput({ title, notes, setTitle, setNotes }: Readonly<FormInputProps>) {
  return (
    <>
      <Input size="md" variant="rounded" className="bg-white text-black">
        <InputField
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
          className="min-h-[40px] py-2 text-black"
        />
      </Input>
      <VStack space="md">
        <MarkdownInput notes={notes} setNotes={setNotes} />
      </VStack>
    </>
  );
}
