import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchComponent from '@/components/shared/search';

describe('SearchComponent', () => {
  let mockHandleSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockHandleSearch = vi.fn();
  });

  it('should render search input', () => {
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const input = screen.getByPlaceholderText('Search Member');
    expect(input).toBeInTheDocument();
  });

  it('should call handleSearch when user types', async () => {
    const user = userEvent.setup();
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const input = screen.getByPlaceholderText('Search Member');
    await user.type(input, 'test');

    expect(mockHandleSearch).toHaveBeenCalled();
  });

  it('should call handleSearch with correct value', () => {
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const input = screen.getByPlaceholderText('Search Member');
    fireEvent.change(input, { target: { value: 'John' } });

    expect(mockHandleSearch).toHaveBeenCalledWith('John');
  });

  it('should render search icon', () => {
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle empty search', () => {
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const input = screen.getByPlaceholderText('Search Member');
    // First type something, then clear it
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });

    // Should have been called at least once with empty string
    expect(mockHandleSearch).toHaveBeenCalled();
    const calls = mockHandleSearch.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toBe('');
  });

  it('should have correct input type', () => {
    render(<SearchComponent handleSearch={mockHandleSearch} />);

    const input = screen.getByPlaceholderText('Search Member');
    expect(input).toHaveAttribute('type', 'search');
  });
});
