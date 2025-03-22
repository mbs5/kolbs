# Kolb's Learning Cycle Tracker

A modern web application for tracking your learning experiences using Kolb's Experiential Learning Cycle. This app helps users systematically document their learning processes and track skill development over time.

## Features

- **Structured Learning Framework**: Document your learning using Kolb's four-stage cycle:
  - Concrete Experience (hands-on experiences)
  - Reflective Observation (insights and observations)
  - Abstract Conceptualization (patterns and theories)
  - Active Experimentation (applying insights)

- **Skill Tracking**: Organize learning cycles by skills, with progress tracking and visual timelines

- **Dashboard Insights**: Get an overview of your learning journey with statistics, progress charts, and upcoming experiments

- **AI-Powered Analysis**: Receive personalized feedback and ratings (1-10) for each stage of your learning cycle, with specific suggestions for improvement

- **Real-time AI Feedback**: Get AI evaluation of your learning cycle entries before submitting to improve quality

- **User Authentication**: Secure authentication with Clerk, including social login options and email/password

- **Collaboration**: Share learning cycles with peers or mentors and engage in discussions

## Tech Stack

- **Frontend**: Next.js with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Data Validation**: Zod
- **Forms**: React Hook Form
- **Database**: SQLite (via Prisma)
- **Authentication**: Clerk
- **AI**: OpenAI API for feedback and analysis

## Getting Started

### Prerequisites

- Node.js 16.8+ and npm/yarn/pnpm
- OpenAI API key (for AI feedback features)
- Clerk account and API keys (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kolbs.git
   cd kolbs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file and add your API keys:
   ```
   # Database
   DATABASE_URL="file:./dev.db"

   # OpenAI API
   OPENAI_API_KEY="your-openai-api-key"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
   CLERK_SECRET_KEY=sk_test_your-secret-key
   CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Setting up Clerk

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Get your API keys from the Clerk dashboard
4. Configure your social login providers if desired
5. Set up a webhook in the Clerk dashboard pointing to `https://your-domain.com/api/webhook/clerk` with the User events

## Project Structure

- `/app`: Next.js App Router pages and layouts
  - `/api`: Backend API routes
  - `/sign-in`, `/sign-up`: Auth pages
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations

## Usage

1. Sign up for an account
2. Create skills you want to develop
3. Start a new learning cycle for a specific skill
4. Document each stage of the learning cycle
5. Get AI feedback on your entries to improve quality
6. Track your progress on the dashboard
7. Receive AI insights and recommendations for your learning journey

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- David A. Kolb for his Experiential Learning Theory
- shadcn/ui for the beautiful UI components
- OpenAI for the AI assistance capabilities
- Clerk for the authentication system
- Vercel for hosting and deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
