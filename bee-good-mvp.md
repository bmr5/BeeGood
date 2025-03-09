# Bee Good App - MVP Specification

## Core Concept

A mobile app that gamifies daily good deeds with personalized suggestions and stats-based progression.

## MVP Features

### 1. User Onboarding

- Simple account creation (optional email/social login)
- Engaging hybrid questionnaire flow with multiple-choice options and optional conversational AI:

  - **Progress Visualization**: Animated bee character flying from flower to flower across the top of each screen, showing progression through onboarding

    - Each completed screen causes the bee to fly to the next flower
    - Flowers change color or bloom when reached
    - Subtle honey trail connects completed flowers
    - Current flower gently pulses to indicate active screen

  - **What Are You Looking to Improve?** (First Screen)

    - Multiple-choice selection with visual icons:
      - Mental wellbeing
      - Physical health
      - Relationships
      - Community connection
      - Environmental impact
      - Personal growth
      - Spiritual practice
      - Work-life balance
    - Multi-select capability with "Select all that apply" instruction
    - Visual feedback showing selected areas

  - **Current Goals** (Second Screen)

    - Chat interface with the bee character asking "What are your goals right now?"
    - Prominent "Skip" button for those who prefer not to share
    - Suggestion chips for common goals (e.g., "Reduce stress", "Connect more")
    - LLM processes responses to inform deed suggestions
    - Brief explanation of how goals help personalize the experience

  - **Basic Demographics** (Third Screen)

    - Age range selection:
      - Under 18
      - 18-24
      - 25-34
      - 35-44
      - 45-54
      - 55-64
      - 65+
    - Option: "I'd prefer to describe my age differently..." (opens chat interface)
    - Simple, friendly interface with visual age representations

  - **Interests and Values** (Fourth Screen)

    - Multiple-choice selection of interests: cooking, reading, fitness, music, art, technology, nature, animals, travel, volunteering
    - Core values selection: family, community, environment, education, health, spirituality, kindness, personal growth
    - Option: "I'd like to share more about my interests and values..." (opens chat interface)
    - Visual icons for each option with multi-select capability
    - LLM interprets chat responses and suggests matching categories for confirmation

  - **Living Situation** (Fifth Screen)

    - Single-choice selection:
      - Living alone
      - With partner/spouse
      - With family (including children)
      - With parents
      - With roommates
      - "I'd like to explain my living situation..." (opens chat interface)
    - Simple illustrations for each option
    - LLM processes detailed responses and suggests appropriate category

  - **Daily Schedule/Routine** (Sixth Screen)

    - Activity pattern selection:
      - Early riser (most active 5am-12pm)
      - Mid-day person (most active 10am-5pm)
      - Evening person (most active 3pm-10pm)
      - Night owl (most active 8pm-2am)
    - Work schedule pattern:
      - Standard weekday (9-5, M-F)
      - Flexible hours
      - Shift work
      - Student
      - Retired/Not working
    - Option: "My schedule is more complex..." (opens chat interface)
    - Visual timeline representation
    - LLM analyzes detailed schedule descriptions and suggests best matching patterns

  - **Available Time for Good Deeds** (Seventh Screen)

    - Single-choice selection:
      - Quick moments (5-10 minutes)
      - Short breaks (10-20 minutes)
      - Dedicated time (20-45 minutes)
      - Extended periods (45+ minutes)
    - Option: "Let me explain my availability..." (opens chat interface)
    - Slider or visual representation of time commitment
    - LLM interprets detailed availability descriptions and suggests appropriate time categories

  - **Religious/Spiritual Background** (Optional Eighth Screen)
    - Clearly marked as optional ("This helps us suggest meaningful deeds")
    - Options including:
      - Major world religions (Christianity, Islam, Judaism, Hinduism, Buddhism, etc.)
      - Spiritual but not religious
      - Not religious/Secular
      - Prefer not to say
      - "I'd like to describe my spiritual perspective..." (opens chat interface)
    - Skip button prominently displayed
    - Reassurance about privacy and how this information will be used
    - LLM processes nuanced spiritual descriptions and suggests appropriate categories

- Initial bee character introduction

  - Default bee with welcome message
  - Brief explanation of how the bee will evolve based on completed deeds
  - Simple name selection for the bee character
  - Option to chat briefly with the bee to establish rapport
  - Celebration animation with bee doing a happy dance when character is named

- **How Your Free Trial Works** (Feature Explanation Screen)

  - Clear visualization of the 7-day free trial period
  - Bullet points highlighting key features available during trial
  - Transparent pricing information for after trial period
  - Reassurance that no payment information is required for trial
  - Option to set a reminder for trial end date
  - Bee character pointing to key information with animated wing gestures

- **Home Screen Widget Preview** (Engagement Screen)

  - Visual mockup of how the widget will look on home screen
  - Explanation of widget features (daily deed suggestion, streak counter)
  - Animation showing how the widget updates with progress
  - Highlight of how the widget provides easy access to daily deeds
  - Bee character appearing in widget demonstration

- **Add to Home Screen CTA** (Final Onboarding Screen)
  - Step-by-step instructions with visuals for adding widget to home screen
  - Clear "Add Widget Now" button
  - Alternative "Remind Me Later" option
  - Brief explanation of benefits (quick access, visual reminders)
  - Celebration animation when widget is successfully added
  - Bee character guiding users through the process with animated gestures

### 2. Good Deed System

- AI-generated daily deed suggestions based on user profile
- Three difficulty levels: Easy, Medium, Challenge
- Six deed categories:
  - Personal Growth
  - Family Bonds
  - Friendship
  - Community Impact
  - Environmental Care
  - Compassion
- Simple deed completion tracking (mark as done)

### 3. Stats Screen (Key Viral Feature)

- Six core goodness categories with:
  - Numerical rating (0-100)
  - Progress increase indicators (+X)
  - Category-specific colors
  - Progress bars
- Overall goodness score
- Simple animations for stat increases
- One-tap sharing to social media

### 4. Character Progression

- Basic bee character with 3 evolution stages
- Visual changes based on deeds completed
- Simple animations for level ups

### 5. Achievement System

- 10-15 initial achievements/badges
- Streak counter (3, 7, 14, 30 days)
- Achievement notifications

### 6. UI Requirements

- Clean, minimalist design
- Honey gold (#F6B93B) and black (#000000) primary colors
- Category-specific accent colors
- Honeycomb visual motifs
- Mobile-first, portrait orientation
- TikTok-friendly aspect ratios for sharing

### 7. Technical Requirements

- Mobile app (iOS and Android)
- Backend for user profiles and deed suggestions
- Simple AI integration for deed personalization
- Social sharing capabilities
- Basic analytics to track user engagement

### 8. Priority Screens

1. Stats Dashboard
2. Daily Deed Suggestion & Completion
3. Character Showcase
4. Achievement Gallery
5. Onboarding Flow

## Future Features (Post-MVP)

- Friend connections
- Community challenges
- Advanced character customization
- Location-based deed suggestions
- Partnerships with nonprofits
