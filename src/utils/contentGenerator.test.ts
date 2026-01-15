import { describe, it, expect } from 'vitest';
import { generateContent, generatePersonName } from './contentGenerator';

describe('generateContent', () => {
  it('should generate content for very negative sentiment (0-0.2)', () => {
    const content = generateContent(0.1);
    expect(content).toBeTruthy();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    // Should contain words associated with negative sentiment
    const lowerContent = content.toLowerCase();
    const hasNegativeWords =
      lowerContent.includes('hate') ||
      lowerContent.includes('angry') ||
      lowerContent.includes('worst') ||
      lowerContent.includes('unacceptable') ||
      lowerContent.includes('disgusted') ||
      lowerContent.includes('falling apart');
    expect(hasNegativeWords).toBe(true);
  });

  it('should generate content for negative sentiment (0.2-0.4)', () => {
    const content = generateContent(0.3);
    expect(content).toBeTruthy();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should generate content for neutral sentiment (0.4-0.6)', () => {
    const content = generateContent(0.5);
    expect(content).toBeTruthy();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    // Neutral content should not contain extreme language
    const lowerContent = content.toLowerCase();
    const hasExtremeWords =
      lowerContent.includes('hate') ||
      lowerContent.includes('love') ||
      lowerContent.includes('worst') ||
      lowerContent.includes('best') ||
      lowerContent.includes('amazing') ||
      lowerContent.includes('terrible');
    expect(hasExtremeWords).toBe(false);
  });

  it('should generate content for positive sentiment (0.6-0.8)', () => {
    const content = generateContent(0.7);
    expect(content).toBeTruthy();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  it('should generate content for very positive sentiment (0.8-1.0)', () => {
    const content = generateContent(0.9);
    expect(content).toBeTruthy();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    // Should contain words associated with positive sentiment
    const lowerContent = content.toLowerCase();
    const hasPositiveWords =
      lowerContent.includes('amazing') ||
      lowerContent.includes('incredible') ||
      lowerContent.includes('best') ||
      lowerContent.includes('love') ||
      lowerContent.includes('fantastic') ||
      lowerContent.includes('wonderful');
    expect(hasPositiveWords).toBe(true);
  });

  it('should handle edge case sentiment values', () => {
    expect(generateContent(0)).toBeTruthy();
    expect(generateContent(0.5)).toBeTruthy();
    expect(generateContent(1)).toBeTruthy();
  });
});

describe('generatePersonName', () => {
  it('should generate a name from agent ID', () => {
    const name = generatePersonName('agent-0');
    expect(name).toBeTruthy();
    expect(typeof name).toBe('string');
    expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/); // Format: "Firstname Lastname"
  });

  it('should generate consistent names for the same ID', () => {
    const name1 = generatePersonName('agent-5');
    const name2 = generatePersonName('agent-5');
    expect(name1).toBe(name2);
  });

  it('should generate different names for different IDs', () => {
    const name1 = generatePersonName('agent-0');
    const name2 = generatePersonName('agent-1');
    const name3 = generatePersonName('agent-2');

    expect(name1).not.toBe(name2);
    expect(name2).not.toBe(name3);
  });

  it('should handle various agent ID formats', () => {
    expect(generatePersonName('agent-0')).toBeTruthy();
    expect(generatePersonName('agent-10')).toBeTruthy();
    expect(generatePersonName('agent-99')).toBeTruthy();
  });

  it('should generate valid names for sequential IDs', () => {
    const names = [];
    for (let i = 0; i < 10; i++) {
      const name = generatePersonName(`agent-${i}`);
      expect(name).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
      names.push(name);
    }

    // Check that we have a variety of names
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBeGreaterThan(5); // At least some variety
  });

  it('should create names with proper capitalization', () => {
    const name = generatePersonName('agent-0');
    const [firstName, lastName] = name.split(' ');

    // First letter should be uppercase
    expect(firstName[0]).toBe(firstName[0].toUpperCase());
    expect(lastName[0]).toBe(lastName[0].toUpperCase());

    // Rest should be lowercase
    expect(firstName.slice(1)).toBe(firstName.slice(1).toLowerCase());
    expect(lastName.slice(1)).toBe(lastName.slice(1).toLowerCase());
  });
});
