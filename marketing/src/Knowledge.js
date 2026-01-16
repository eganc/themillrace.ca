export const KnowledgeBase = {
  about: {
    text: `A millrace is the engineered channel that directs river water to turn mill wheels. It transforms natural flow into useful work.
  
We're based in Manotick, Ontario, right next to the Long Island Locks on the Rideau Canal—where precision engineering has been creating power for nearly two centuries.`,
    artifact: { type: 'map', lat: 45.2268, lng: -75.6831, label: 'Manotick Lock Station' },
    physics: 'active'
  },

  services: {
    text: `We offer two primary channels of expertise:

1. PRODUCT GUIDANCE: Strategy that ships.
2. SOFTWARE DEVELOPMENT: Focused, high-precision applications.`,
    artifact: {
      type: 'blueprint',
      items: ['Product Roadmapping', 'System Architecture', 'AI Integration', 'Custom Dashboards'],
      code: 'SYSTEM_CAPABILITY_MATRIX'
    },
    physics: 'active'
  },

  philosophy: {
    text: `Our core directive is simple: WE BUILD USEFUL THINGS. 

We avoid jargon moats and strategy decks that sit in drawers. We are builders who think strategically—bridging the gap between technical rigor and product vision.`,
    artifact: { type: 'quote', source: 'Millrace Core Directive', text: 'PRECISION OVER PROXIMITY' },
    physics: 'calm'
  },

  founder: {
    text: `The Millrace Co. was founded by Egan Cheung, a builder focused on useful software solutions for Canadian tech startups.`,
    artifact: { type: 'tag', label: 'DIRECTOR', value: 'EGAN CHEUNG' },
    physics: 'calm'
  },

  tech: {
    text: `Our stack is focused on velocity and maintenance: React, Node.js, AI-augmented development, and tailored cloud infrastructure.`,
    artifact: { type: 'stats', labels: ['Velocity', 'Stability', 'Precision'], values: [98, 95, 100] },
    physics: 'rapid'
  },

  contact: {
    text: `Channels open. You can reach the command center via direct frequency (email).`,
    artifact: {
      type: 'contact',
      email: 'hello@themillrace.ca',
      twitter: 'linkedin.com/company/themillrace',
      status: 'OPEN FOR CONTRACTS'
    },
    physics: 'active'
  }
};

export const findAnswer = (query) => {
  const q = query.toLowerCase().trim();

  if (q.includes('about') || q.includes('story') || q.includes('who') || q.includes('what is')) return KnowledgeBase.about;
  if (q.includes('service') || q.includes('do') || q.includes('build') || q.includes('offer')) return KnowledgeBase.services;
  if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('talk') || q.includes('hire')) return KnowledgeBase.contact;
  if (q.includes('phil') || q.includes('why') || q.includes('mission') || q.includes('useful')) return KnowledgeBase.philosophy;
  if (q.includes('egan') || q.includes('founder') || q.includes('team')) return KnowledgeBase.founder;
  if (q.includes('tech') || q.includes('stack') || q.includes('how')) return KnowledgeBase.tech;
  if (q.includes('location') || q.includes('where')) return KnowledgeBase.about;

  if (q === 'help' || q === '?') {
    return {
      text: "Available query nodes: ABOUT, SERVICES, PHILOSOPHY, TECH, FOUNDER, CONTACT.",
      artifact: null,
      physics: 'calm'
    };
  }

  return {
    text: `Searching Knowledge Library for "${query.toUpperCase()}"... No exact match found.`,
    artifact: null,
    physics: 'active'
  };
};
