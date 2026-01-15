// Procedurally generate tweet-like content based on sentiment

const veryNegativeContent = [
  "This is absolutely unacceptable. I can't believe this is happening.",
  "Completely fed up with everything right now. This needs to change.",
  "I'm so angry I can barely think straight. This is infuriating.",
  "Everything is falling apart and nobody seems to care.",
  "This is the worst day ever. Nothing is going right.",
  "I hate how things are going. This is ridiculous.",
  "Absolutely disgusted by what I'm seeing. Unbelievable.",
  "Can't take this anymore. Everything is going wrong.",
];

const negativeContent = [
  "Really not happy with how things turned out today.",
  "This situation is pretty frustrating to be honest.",
  "Not a fan of what's happening lately. Could be better.",
  "Disappointed by recent events. Expected more.",
  "Things aren't going the way I hoped they would.",
  "This is getting tiresome. When will it improve?",
  "Feeling pretty down about all of this.",
  "Not my best day. Hope tomorrow is better.",
];

const neutralContent = [
  "Just finished my coffee. Time to get back to work.",
  "Observed some interesting patterns today.",
  "Another day, another update. Here's what I'm seeing.",
  "Making my way through the week. How's everyone doing?",
  "Just sharing my thoughts on the current situation.",
  "It's been a pretty average day so far.",
  "Checking in to see what everyone else thinks.",
  "Here's my take on what's been happening.",
];

const positiveContent = [
  "Things are looking up! Feeling optimistic today.",
  "Really pleased with how everything is going.",
  "Had a great day today. Hope yours was good too!",
  "Feeling pretty good about recent developments.",
  "This is turning out better than I expected.",
  "Happy to see some positive changes happening.",
  "Nice to see things moving in the right direction.",
  "Grateful for all the good things happening lately.",
];

const veryPositiveContent = [
  "This is absolutely amazing! Best day ever!",
  "I'm so incredibly happy right now! Everything is perfect!",
  "Wow! This is exactly what I was hoping for and more!",
  "Feeling absolutely fantastic! Life is wonderful!",
  "This is incredible! I couldn't be more excited!",
  "So thrilled about everything! This is the best!",
  "Amazing news! Everything is working out perfectly!",
  "I love this! Everything is going so well!",
];

export function generateContent(sentiment: number): string {
  let pool: string[];

  if (sentiment < 0.2) {
    pool = veryNegativeContent;
  } else if (sentiment < 0.4) {
    pool = negativeContent;
  } else if (sentiment < 0.6) {
    pool = neutralContent;
  } else if (sentiment < 0.8) {
    pool = positiveContent;
  } else {
    pool = veryPositiveContent;
  }

  // Use post ID or timestamp as seed for consistent generation
  // For now, just pick randomly
  return pool[Math.floor(Math.random() * pool.length)];
}

// Generate a person name based on ID
export function generatePersonName(agentId: string): string {
  const firstNames = [
    'Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery',
    'Quinn', 'Reese', 'Dakota', 'Skyler', 'Peyton', 'Cameron', 'Blake', 'Drew',
    'Charlie', 'Finley', 'Hayden', 'Jamie', 'Kennedy', 'Logan', 'Parker', 'River',
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez',
    'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen',
  ];

  // Extract number from agent-X format
  const num = parseInt(agentId.split('-')[1] || '0');

  const firstNameIndex = num % firstNames.length;
  const lastNameIndex = Math.floor(num / firstNames.length) % lastNames.length;

  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
}
