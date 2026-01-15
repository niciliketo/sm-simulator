import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveFeed } from './LiveFeed';
import type { Post } from '../engine/types';

describe('LiveFeed', () => {
  it('should render empty state when no posts', () => {
    render(<LiveFeed posts={[]} />);

    expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Start the simulation to see activity/i)).toBeInTheDocument();
  });

  it('should render the Live Feed header', () => {
    render(<LiveFeed posts={[]} />);

    expect(screen.getByText(/Live Feed/i)).toBeInTheDocument();
  });

  it('should render a single post with person name', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.5,
        timestamp: 1,
      },
    ];

    render(<LiveFeed posts={posts} />);

    // Should show person name (generated from agent-0)
    expect(screen.getByText(/Alex Smith/i)).toBeInTheDocument();

    // Should show timestamp
    expect(screen.getByText(/Tick 1/i)).toBeInTheDocument();
  });

  it('should render multiple posts', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.3,
        timestamp: 1,
      },
      {
        id: 'post-2-agent-1',
        authorId: 'agent-1',
        sentiment: 0.7,
        timestamp: 2,
      },
      {
        id: 'post-3-agent-2',
        authorId: 'agent-2',
        sentiment: 0.5,
        timestamp: 3,
      },
    ];

    render(<LiveFeed posts={posts} />);

    // All three posts should be visible
    expect(screen.getByText(/Alex Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Sam Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Jordan Smith/i)).toBeInTheDocument();

    // All timestamps should be visible
    expect(screen.getByText(/Tick 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Tick 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Tick 3/i)).toBeInTheDocument();
  });

  it('should show sentiment labels for different sentiments', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.1, // Very negative
        timestamp: 1,
      },
      {
        id: 'post-2-agent-1',
        authorId: 'agent-1',
        sentiment: 0.5, // Neutral
        timestamp: 2,
      },
      {
        id: 'post-3-agent-2',
        authorId: 'agent-2',
        sentiment: 0.9, // Very positive
        timestamp: 3,
      },
    ];

    render(<LiveFeed posts={posts} />);

    expect(screen.getByText(/Negative/i)).toBeInTheDocument();
    expect(screen.getByText(/Neutral/i)).toBeInTheDocument();
    expect(screen.getByText(/Positive/i)).toBeInTheDocument();
  });

  it('should display generated content for posts', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.5,
        timestamp: 1,
      },
    ];

    const { container } = render(<LiveFeed posts={posts} />);

    // Should show person name
    expect(screen.getByText(/Alex Smith/i)).toBeInTheDocument();

    // Should have generated content text (find paragraphs which contain the actual content)
    const contentParagraphs = container.querySelectorAll('p');
    expect(contentParagraphs.length).toBeGreaterThan(0);

    // At least one paragraph should have substantial content
    const hasSubstantialContent = Array.from(contentParagraphs).some(
      p => p.textContent && p.textContent.length > 20
    );
    expect(hasSubstantialContent).toBe(true);
  });

  it('should limit display to 20 most recent posts', () => {
    const posts: Post[] = Array.from({ length: 30 }, (_, i) => ({
      id: `post-${i}-agent-${i % 5}`,
      authorId: `agent-${i % 5}`,
      sentiment: 0.5,
      timestamp: i,
    }));

    render(<LiveFeed posts={posts} />);

    // Should show the latest tick (29) but not the earliest (0-9)
    expect(screen.getByText(/Tick 29/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tick 0/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tick 5/i)).not.toBeInTheDocument();
  });

  it('should render posts in reverse chronological order (newest first)', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.5,
        timestamp: 1,
      },
      {
        id: 'post-2-agent-1',
        authorId: 'agent-1',
        sentiment: 0.5,
        timestamp: 2,
      },
      {
        id: 'post-3-agent-2',
        authorId: 'agent-2',
        sentiment: 0.5,
        timestamp: 3,
      },
    ];

    const { container } = render(<LiveFeed posts={posts} />);

    const timestamps = Array.from(container.querySelectorAll('[class*="text-xs text-slate-500"]'))
      .map(el => el.textContent)
      .filter(text => text?.includes('Tick'));

    // First timestamp should be the newest (Tick 3)
    expect(timestamps[0]).toContain('Tick 3');
    expect(timestamps[timestamps.length - 1]).toContain('Tick 1');
  });

  it('should render sentiment bars with correct width', () => {
    const posts: Post[] = [
      {
        id: 'post-1-agent-0',
        authorId: 'agent-0',
        sentiment: 0.25, // 25% width
        timestamp: 1,
      },
      {
        id: 'post-2-agent-1',
        authorId: 'agent-1',
        sentiment: 0.75, // 75% width
        timestamp: 2,
      },
    ];

    const { container } = render(<LiveFeed posts={posts} />);

    const sentimentBars = container.querySelectorAll('[style*="width"]');

    // Should have bars with appropriate widths
    const widths = Array.from(sentimentBars)
      .map(el => (el as HTMLElement).style.width)
      .filter(width => width.includes('%'));

    expect(widths).toContain('25%');
    expect(widths).toContain('75%');
  });
});
