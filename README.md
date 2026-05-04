# Piazza API — Cloud Software as a Service

## 📖 Overview
**Piazza** is a RESTful Cloud Software as a Service (SaaS) for a Twitter-like system. In Piazza, users post messages for a particular topic while others browse posts and perform fundamental interactions, including liking, disliking, or adding a comment. This project was developed as part of the 2023-2024 Cloud Computing Coursework.

## 🛠️ Technologies & Dependencies
This project is built using the following core technologies:
* **Backend Framework:** Node.js using the Express package.
* **Database:** MongoDB with `mongoose` for object data modeling.
* **Authentication:** oAuth v2 protocol using `jsonwebtoken` (JWT) and NodeJS. Passwords are secured using `bcryptjs`.
* **Testing:** Postman, Node.js, or Python for automated HTTP requests.

**Additional NPM Modules Used:**
* `joi`: To enforce a verification process for user input validation.
* `node-cron`: To automate the scheduling and updating of the post-expiration time.
* `mongoose-sequence`: To generate sequential and unique post identifiers.
* `dotenv`: To manage environment variables securely.
* `body-parser`: To parse incoming JSON request bodies.
* `nodemon`: For automatic server restarts during local development.

## ✨ Core Features
* **Secure Authorization:** Authorised users access the API using the oAuth v2 protocol and JWT. Unauthorised users are not allowed to access resources and perform database requests.
* **Topic-Based Posting:** Authorised users post a message for a particular topic. Posts must belong to one of four categories: Politics, Health, Sport, or Tech.
* **Post Expiration:** Posts are created with a post-expiration time. After the end of this time, the message will remain on the Piazza wall but will not accept any further actions (likes, dislikes, or comments). The status of a post changes from "Live" to "Expired".
* **User Interactions:** Registered users can perform basic operations, including "like", "dislike", or "comment" a message. The system enforces logical rules, such as preventing a post owner from liking their own messages.
* **Advanced Browsing:** Authorised users can browse for the most active post per topic with the highest likes and dislikes. Authorised users can also browse the history data of expired posts per topic.

## 🚀 Local Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd coursework
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory to store your configurations securely:
```env
DB_CONNECTOR=your_mongodb_connection_string
TOKEN_SECRET=your_super_secret_jwt_key
```

### 4. Start the server
```bash
npm start
```
The application will launch using `nodemon` for hot-reloading at `http://localhost:3000`.

## 🧪 Testing Scenarios
The API logic and endpoints have been designed to pass twenty specific test cases (TCs) to verify system functionality. Highlighted scenarios include:
* **TC 3:** Unsuccessful calls to the API without using a valid token.
* **TC 4 & 17:** Posting messages with an expiration time (e.g., 5 minutes) and verifying that interactions fail after the post-expiration time ends.
* **TC 11:** Ensuring that a post owner cannot like their own messages.
* **TC 12:** Users commenting on a post in a round-robin fashion.
* **TC 20:** Querying for an active post with the highest interest (maximum number of likes and dislikes) in a specific topic.

## 📂 Folder Structure 
* `/models` — Mongoose schemas (User, Post, Interaction).
* `/routes` — API endpoint definitions.
* `/middleware` — JWT verification and Joi validation logic.
* `app.js` — Application entry point.

---