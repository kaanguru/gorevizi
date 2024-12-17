import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TutorialScreen from '../app/(onboarding)/tutorial';
import Login from "~/app/(auth)/login";
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Get the mocked router
const mockRouter = router;

describe('TutorialScreen', () => {

  it('navigates through tutorials', async () => {
    const { getByText } = render(<TutorialScreen />);
    const continueButton = getByText('Continue');
    setTimeout(() => {
        expect(getByText('Tutorial 1')).toBeTruthy();
    }, 1000);
    fireEvent.press(continueButton);
    expect(getByText('Tutorial 2')).toBeTruthy();
    
    fireEvent.press(continueButton);
    setTimeout(() => {
        expect(getByText('Tutorial 3')).toBeTruthy();
        fireEvent.press(getByText('Get Started'));
    }, 1000);
    setTimeout(() => {
        expect(getByText('Login')).toBeTruthy();
        fireEvent.press(getByText('Login'));
    }, 1000);
  });
  it('renders login page and navigates to register',  () => {
    const { getByText, getByTestId } = render(<Login />);

    // Check "Welcome Back" text
    expect(getByText('Welcome Back')).toBeTruthy();

    // Click on "Don't have an account?" link
    const registerLink = getByTestId('register-link');
    fireEvent.press(registerLink);

    // Verify navigation to register page
    expect(mockRouter.push).toHaveBeenCalledWith('/register');
  });

});
