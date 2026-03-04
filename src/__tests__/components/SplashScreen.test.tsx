import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@/__tests__/utils/test-utils';
import { SplashScreen } from '@/components/layout/SplashScreen';

// Mock framer-motion to render plain divs with data attributes for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => (
      <div
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('next/image', () => ({
  default: function MockImage({ src, alt, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('@/components/auth/login-loading', () => ({
  default: () => <div data-testid="login-loading">Loading Spinner</div>,
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render logo during loading', () => {
      render(
        <SplashScreen>
          <div data-testid="child-content">Page Content</div>
        </SplashScreen>
      );

      const logo = screen.getByAltText('Cubing Kerala');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logotransparent.png');
    });

    it('should render the loading spinner during loading', () => {
      render(
        <SplashScreen>
          <div data-testid="child-content">Page Content</div>
        </SplashScreen>
      );

      expect(screen.getByTestId('login-loading')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <SplashScreen>
          <div data-testid="child-content">Page Content</div>
        </SplashScreen>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
  });

  describe('Loading Behavior', () => {
    it('should hide splash screen after timeout', async () => {
      render(
        <SplashScreen>
          <div data-testid="child-content">Page Content</div>
        </SplashScreen>
      );

      // Splash should be visible initially
      expect(screen.getByAltText('Cubing Kerala')).toBeInTheDocument();

      // Advance past the 1400ms timeout
      await act(async () => {
        vi.advanceTimersByTime(1400);
      });

      expect(screen.queryByAltText('Cubing Kerala')).not.toBeInTheDocument();
    });

    it('should not hide splash screen before timeout', () => {
      render(
        <SplashScreen>
          <div data-testid="child-content">Page Content</div>
        </SplashScreen>
      );

      // Advance only partially
      vi.advanceTimersByTime(1000);

      // Splash should still be visible
      expect(screen.getByAltText('Cubing Kerala')).toBeInTheDocument();
      expect(screen.getByTestId('login-loading')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <SplashScreen>
          <div>Content</div>
        </SplashScreen>
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});
