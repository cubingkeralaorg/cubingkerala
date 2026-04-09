import { describe, it, expect, vi, afterEach } from 'vitest';
import { isMobileDevice } from '@/lib/utils';

describe('isMobileDevice', () => {
  const originalUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  afterEach(() => {
    vi.stubGlobal('navigator', { userAgent: originalUserAgent });
  });

  it('should return false for Desktop Chrome', () => {
    vi.stubGlobal('navigator', { 
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36' 
    });
    expect(isMobileDevice()).toBe(false);
  });

  it('should return true for iPhone', () => {
    vi.stubGlobal('navigator', { 
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
    });
    expect(isMobileDevice()).toBe(true);
  });

  it('should return true for Android Phone (Mobi)', () => {
    vi.stubGlobal('navigator', { 
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36' 
    });
    expect(isMobileDevice()).toBe(true);
  });

  it('should return true for iPad', () => {
    vi.stubGlobal('navigator', { 
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' 
    });
    expect(isMobileDevice()).toBe(true);
  });

  it('should return false for Desktop Safari', () => {
    vi.stubGlobal('navigator', { 
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15' 
    });
    expect(isMobileDevice()).toBe(false);
  });
});
