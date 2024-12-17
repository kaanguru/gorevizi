import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TutorialScreen from '../app/(onboarding)/tutorial';
import { useRouter } from 'expo-router';

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

  it('renders correctly', () => {
    const { getByText } = render(<TutorialScreen />);
    setTimeout(() => {
      expect(getByText('Tutorial 1')).toBeTruthy();
    }, 2300);
  });

  it('navigates through tutorials', () => {
    const { getByText } = render(<TutorialScreen />);

    const continueButton = getByText('Continue');

    fireEvent.press(continueButton);
    expect(getByText('Tutorial 2')).toBeTruthy();

    fireEvent.press(continueButton);
    setTimeout(() => {
      expect(getByText('Tutorial 3')).toBeTruthy();
    }, 1300);
    const getStartedButton = getByText('Get Started');
    fireEvent.press(getStartedButton);

    // Verify navigation to start screen
    expect(mockReplace).toHaveBeenCalledWith('/(onboarding)/start');
  });
});
