import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailBanner } from '@/components/layout/EmailBanner';
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

describe('EmailBanner', () => {
  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ isLoggedIn: true });
    (useUserProfile as any).mockReturnValue({
      profile: { isMember: true, email: null, emailConsent: false },
      isLoading: false,
      updateProfile: mockUpdateProfile,
      isUpdating: false,
    });
  });

  it('renders nothing if not logged in', () => {
    (useAuth as any).mockReturnValue({ isLoggedIn: false });
    const { container } = render(<EmailBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if not a member', () => {
    (useUserProfile as any).mockReturnValue({
      profile: { isMember: false },
      isLoading: false,
    });
    const { container } = render(<EmailBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if has email and consent', () => {
    (useUserProfile as any).mockReturnValue({
      profile: { isMember: true, email: 'test@test.com', emailConsent: true },
      isLoading: false,
    });
    const { container } = render(<EmailBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('shows add email form when email is missing', () => {
    render(<EmailBanner />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Add Email')).toBeInTheDocument();
  });

  it('validates email format before submitting', async () => {
    render(<EmailBanner />);
    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByText('Add Email');

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.submit(button.closest('form') as HTMLFormElement);

    expect(toast.error).toHaveBeenCalledWith('Please enter a valid email address');
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it('submits valid email successfully', async () => {
    render(<EmailBanner />);
    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByText('Add Email');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.submit(button.closest('form') as HTMLFormElement);

    expect(mockUpdateProfile).toHaveBeenCalledWith({ email: 'test@example.com' });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Email added successfully!');
    });
  });

  it('shows consent form if email exists but no consent', () => {
    (useUserProfile as any).mockReturnValue({
      profile: { isMember: true, email: 'test@example.com', emailConsent: false },
      isLoading: false,
      updateProfile: mockUpdateProfile,
      isUpdating: false,
    });
    render(<EmailBanner />);
    
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(screen.getByText('Yes, keep me updated')).toBeInTheDocument();
    expect(screen.getByText('No thanks')).toBeInTheDocument();
  });

  it('handles consent correctly', async () => {
    (useUserProfile as any).mockReturnValue({
      profile: { isMember: true, email: 'test@example.com', emailConsent: false },
      isLoading: false,
      updateProfile: mockUpdateProfile,
      isUpdating: false,
    });
    render(<EmailBanner />);
    
    fireEvent.click(screen.getByText('Yes, keep me updated'));
    expect(mockUpdateProfile).toHaveBeenCalledWith({ emailConsent: true });
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('You are now subscribed to updates!');
    });
  });
});
