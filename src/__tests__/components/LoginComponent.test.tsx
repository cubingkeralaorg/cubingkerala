import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import LoginComponent from '@/components/auth/login-form';

// Mock the child components
vi.mock('@/components/auth/login-lottie', () => ({
  default: () => <div data-testid="login-lottie">Lottie Animation</div>,
}));

vi.mock('@/components/auth/login-loading', () => ({
  default: () => <div data-testid="login-loading">Loading...</div>,
}));

vi.mock('@/components/shared', () => ({
  GradientText: ({ name }: { name: string }) => <h1 data-testid="gradient-text">{name}</h1>,
}));

vi.mock('@/components/ui/rainbow-button', () => ({
  RainbowButton: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="rainbow-button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/magicui/dot-pattern', () => ({
  default: () => <div data-testid="dot-pattern" />,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardFooter: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../../app/login/loading', () => ({
  default: () => <div data-testid="page-loading">Page Loading</div>,
}));

vi.mock('next/image', () => ({
  default: function MockImage({ src, alt, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('LoginComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  describe('Rendering', () => {
    it('should render the login page with all elements', () => {
      render(<LoginComponent />);

      expect(screen.getByTestId('gradient-text')).toHaveTextContent('Cubing Kerala');
      expect(screen.getByText('Authenticate with World Cube Association')).toBeInTheDocument();
      expect(screen.getByTestId('login-lottie')).toBeInTheDocument();
      expect(screen.getByTestId('rainbow-button')).toBeInTheDocument();
    });

    it('should render the WCA logo and login text', () => {
      render(<LoginComponent />);

      const wcaLogo = screen.getByAltText('wca-logo');
      expect(wcaLogo).toBeInTheDocument();
      expect(wcaLogo).toHaveAttribute('src', '/WCALogo.svg');
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should render the dot pattern background', () => {
      render(<LoginComponent />);

      expect(screen.getByTestId('dot-pattern')).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('should have login button enabled initially', () => {
      render(<LoginComponent />);

      const loginButton = screen.getByTestId('rainbow-button');
      expect(loginButton).not.toBeDisabled();
    });

    it('should not show loading state initially', () => {
      render(<LoginComponent />);

      expect(screen.queryByTestId('login-loading')).not.toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should scroll to top on mount', () => {
      render(<LoginComponent />);

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('Login Flow', () => {
    it('should navigate to auth/login on button click', async () => {
      const { user } = render(<LoginComponent />);

      const loginButton = screen.getByTestId('rainbow-button');
      await user.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith('/api/auth/login');
    });

    it('should show loading state when login is clicked', async () => {
      const { user } = render(<LoginComponent />);

      const loginButton = screen.getByTestId('rainbow-button');
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-loading')).toBeInTheDocument();
      });
    });

    it('should disable button during loading', async () => {
      const { user } = render(<LoginComponent />);

      const loginButton = screen.getByTestId('rainbow-button');
      await user.click(loginButton);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });

    it('should hide login text during loading', async () => {
      const { user } = render(<LoginComponent />);

      await user.click(screen.getByTestId('rainbow-button'));

      await waitFor(() => {
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper image alt text', () => {
      render(<LoginComponent />);

      const wcaLogo = screen.getByAltText('wca-logo');
      expect(wcaLogo).toBeInTheDocument();
    });

    it('should have descriptive button content', () => {
      render(<LoginComponent />);

      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should reset loading state on unmount', () => {
      const { unmount } = render(<LoginComponent />);
      
      unmount();
      
      // Re-render should show initial state
      render(<LoginComponent />);
      expect(screen.queryByTestId('login-loading')).not.toBeInTheDocument();
    });
  });
});
