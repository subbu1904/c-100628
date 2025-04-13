
# CryptoView Backend

This is the backend for the CryptoView application, providing API endpoints for the frontend.

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and update the environment variables
4. Create a PostgreSQL database and run the schema SQL from `src/config/schema.sql`
5. Start the development server with `npm run dev`

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with email and password
- `POST /api/users/login/otp` - Login with OTP
- `POST /api/users/send-otp` - Send OTP to email

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upgrade` - Upgrade to premium
- `POST /api/users/downgrade` - Downgrade to free

### Assets

- `GET /api/assets` - Get list of assets
- `GET /api/assets/:id` - Get asset details

### Categories

- `GET /api/categories` - Get list of categories
- `GET /api/categories/:id` - Get category details

### Super Categories

- `GET /api/super-categories` - Get list of super categories
- `GET /api/super-categories/:id` - Get super category details

### Announcements

- `GET /api/announcements/banner` - Get announcement banner
- `PUT /api/announcements/banner` - Update announcement banner (admin only)
- `GET /api/announcements` - Get all announcements (admin only)
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

### Messages

- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id` - Get messages in conversation
- `POST /api/messages` - Send message
- `PUT /api/messages/read` - Mark messages as read

### Predictions

- `GET /api/predictions` - Get user predictions
- `GET /api/predictions/:id` - Get prediction details
- `POST /api/predictions` - Create prediction
- `PUT /api/predictions/:id` - Update prediction
- `DELETE /api/predictions/:id` - Delete prediction
- `POST /api/predictions/:id/vote` - Vote on prediction

## Development

### Project Structure

- `src/index.ts` - Entry point
- `src/config/` - Configuration files
- `src/controllers/` - API controllers
- `src/middleware/` - Express middleware
- `src/repositories/` - Data access layer
- `src/routes/` - API routes
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Database

The application uses PostgreSQL with the following tables:

- users
- user_memberships
- assets
- categories
- super_categories
- predictions
- messages
- conversations
- announcements

See `src/config/schema.sql` for the complete schema.

### Authentication

The application uses JWT for authentication. Protected routes require a valid JWT token in the Authorization header.

## Deployment

1. Build the application with `npm run build`
2. Set up environment variables in production
3. Start the server with `npm start`

