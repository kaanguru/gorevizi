import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../auth/auth';
import { supabase } from '../auth/supabase';

jest.mock('../auth/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('useAuth', () => {
  it('should sign in with email and password', async () => {
    const { result } = renderHook(useAuth);

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

    await act(async () => {
      await result.current.signInWithEmail('test@example.com', 'password');
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign up with email and password', async () => {
    const { result } = renderHook(useAuth);

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({ data: {}, error: null });

    await act(async () => {
      await result.current.signUpWithEmail('test@example.com', 'password');
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign out', async () => {
    const { result } = renderHook(useAuth);

    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
