# Chef AI - Smart Recipe Generator

## Overview
Chef AI is an intelligent recipe generator that helps users create delicious meals using the ingredients they have. Simply enter the available ingredients, and Chef AI will suggest the top six recipes with detailed steps. Users can tweak any recipe as per their preference for a personalized cooking experience.

## Features
- **AI-Powered Recipe Generation**: Uses Google Gemini AI to generate recipes based on user-inputted ingredients.
- **Customizable Recipes**: Modify any suggested recipe to suit your taste.
- **User Authentication**: Secure authentication with NextAuth.
- **Modern UI/UX**: Built with Tailwind CSS, ShadCN components, and Framer Motion for a seamless and engaging experience.
- **Database Management**: Prisma ORM for efficient database operations.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend**: Next.js API routes, Prisma ORM
- **AI Integration**: Google Gemini AI
- **Authentication**: NextAuth
- **Database**: PostgreSQL (or any compatible Prisma-supported database)

## Installation
### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (or any Prisma-compatible database)
- Google Gemini AI API Key

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/chef-ai.git
   cd chef-ai
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your-database-url
   NEXTAUTH_SECRET=your-nextauth-secret
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. Set up the database:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
1. Log in using NextAuth authentication.
2. Enter available ingredients in the search bar.
3. Chef AI will generate six recipe suggestions.
4. Click on any recipe to view detailed steps.
5. Modify ingredients or steps if needed.
6. Enjoy cooking!

## Future Enhancements
- **Save Favorite Recipes**: Users can save and revisit recipes.
- **Recipe Ratings & Reviews**: Let users rate and review recipes.
- **Shopping List Generator**: Suggest missing ingredients for a selected recipe.
- **Multilingual Support**: Support for multiple languages.


