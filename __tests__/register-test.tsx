import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react';
import { useRouter } from 'expo-router';
import Register from '~/app/(auth)/register';

// Mock the useRouter hook
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('TutorialScreen', () => {
  // Setup mock router before each test
  const mockReplace = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('registers with fake email and password', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const registerButton = getByText('Create Account');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    await act(async () => {
      fireEvent.press(registerButton);
    });

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });
});
