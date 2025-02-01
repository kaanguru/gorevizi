import React from 'react-native';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { FormInputProps } from '@/types';

export function FormInput({ title, notes, setTitle, setNotes }: Readonly<FormInputProps>) {
  return (
    <>
      <Input size="md" variant="rounded" className="bg-white">
        <InputField
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
          className="min-h-[40px] py-2 text-typography-900"
          placeholderTextColor="#9CA3AF"
        />
      </Input>

      <Textarea size="md" className="bg-white">
        <TextareaInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          className="min-h-[80px] py-2 text-typography-900"
          placeholderTextColor="#9CA3AF"
        />
      </Textarea>
    </>
  );
}
