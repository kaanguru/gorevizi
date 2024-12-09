import { render } from '@testing-library/react-native';

import TutorialScreen from '@/app/(onboarding)/tutorial';

describe('TutorialScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TutorialScreen />);
    expect(getByText('Tutorial 2')).toBeTruthy();
  });
});
