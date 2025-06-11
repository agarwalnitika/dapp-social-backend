# dApp Social Backend

A decentralized social media backend built with NestJS, TypeORM, and Ethereum wallet authentication. This backend powers a social media platform where users can interact using their Ethereum wallets.

## Features

- 🔐 Ethereum wallet-based authentication
- 👤 User profile management
- 📝 Create and manage posts
- 💬 Comment system
- ❤️ Like system
- 🔍 Get posts with like and comment counts
- 🔗 User relationships and interactions

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Ethereum wallet signatures
- **Blockchain**: ethers.js for wallet interaction
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dapp-social-backend.git
cd dapp-social-backend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dapp_social
JWT_SECRET=your_jwt_secret_key
```

4. Start the database:

```bash
# Make sure PostgreSQL is running
```

5. Run migrations:

```bash
npm run typeorm migration:run
# or
yarn typeorm migration:run
```

## Running the Application

Development mode:

```bash
npm run start:dev
# or
yarn start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## API Endpoints

### Authentication

- `POST /auth/verify`
  - Authenticate user with Ethereum wallet signature
  - Body: `{ message: string, signature: string, address: string }`
  - Returns: `{ success: boolean, token?: string }`

### Users

- `GET /users/:wallet`
  - Get user profile by wallet address
  - Returns: User profile data
- `POST /users`
  - Create or update user profile
  - Body: User profile data
  - Returns: Updated user profile

### Posts

- `GET /posts`
  - Get all posts with like and comment counts
  - Returns: Array of posts with metadata
- `GET /posts/:id`
  - Get a single post with comments and like count
  - Returns: Post with full details
- `POST /posts`
  - Create a new post
  - Body: `{ wallet_address: string, content: string }`
  - Returns: Created post

## Database Schema

### Users

- `wallet_address` (primary key)
- `username`
- `profile_picture_url`
- `bio`

### Posts

- `id` (primary key)
- `wallet_address` (foreign key to users)
- `content`
- `timestamp`

### Comments

- `id` (primary key)
- `post_id` (foreign key to posts)
- `wallet_address` (foreign key to users)
- `content`
- `timestamp`

### Likes

- `id` (primary key)
- `post_id` (foreign key to posts)
- `wallet_address` (foreign key to users)
- `timestamp`

## Security

- All endpoints except authentication require a valid JWT token
- Ethereum wallet signatures are verified using ethers.js
- Database queries are parameterized to prevent SQL injection
- Input validation is implemented using NestJS DTOs
