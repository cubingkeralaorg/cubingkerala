import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CubingKeralaFooter from '@/components/layout/footer';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

describe('CubingKeralaFooter', () => {
  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ isLoggedIn: false });
    (useUserProfile as any).mockReturnValue({
      profile: null,
      isLoading: false,
      updateProfile: mockUpdateProfile,
      isUpdating: false,
    });
  });

  it('does not render login or logout in the footer', () => {
    render(<CubingKeralaFooter />);
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();

    (useAuth as any).mockReturnValue({ isLoggedIn: true });
    render(<CubingKeralaFooter />);
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  describe('Email Subscription UI', () => {
    it('shows subscribe/unsubscribe button when logged in with email', () => {
      (useAuth as any).mockReturnValue({ isLoggedIn: true });
      (useUserProfile as any).mockReturnValue({
        profile: { email: 'test@example.com', emailConsent: true },
        updateProfile: mockUpdateProfile,
      });
      render(<CubingKeralaFooter />);
      
      expect(screen.getByText('Unsubscribe from Emails')).toBeInTheDocument();
      expect(screen.getByText('Update Email Address')).toBeInTheDocument();
    });

    it('toggles subscription when clicked', async () => {
      (useAuth as any).mockReturnValue({ isLoggedIn: true });
      (useUserProfile as any).mockReturnValue({
        profile: { email: 'test@example.com', emailConsent: true },
        updateProfile: mockUpdateProfile,
      });
      render(<CubingKeralaFooter />);
      
      fireEvent.click(screen.getByText('Unsubscribe from Emails'));
      expect(mockUpdateProfile).toHaveBeenCalledWith({ emailConsent: false });
    });

    it('handles email update with validation', async () => {
      (useAuth as any).mockReturnValue({ isLoggedIn: true });
      (useUserProfile as any).mockReturnValue({
        profile: { email: 'test@example.com', emailConsent: true },
        updateProfile: mockUpdateProfile,
      });
      render(<CubingKeralaFooter />);
      
      // Open edit mode
      fireEvent.click(screen.getByText('Update Email Address'));
      
      const input = screen.getByPlaceholderText('New email address');
      const saveBtn = screen.getByText('Save');
      
      // Invalid email
      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.click(saveBtn);
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address');
      expect(mockUpdateProfile).not.toHaveBeenCalled();

      // Valid email
      fireEvent.change(input, { target: { value: 'new@example.com' } });
      fireEvent.click(saveBtn);
      expect(mockUpdateProfile).toHaveBeenCalledWith({ email: 'new@example.com' });
    });
  });
});
