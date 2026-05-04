const express = require('express')
const app = express()
const cron = require('node-cron');
const Post = require('./models/Posts'); 

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const posts = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/posts',posts)
app.use('/api/user',authRoute)

mongoose.connect(process.env.DB_CONNECTOR).then(()=>{
    console.log('Your mongoDB connector is on...')
})

// Function to check expired posts
async function checkExpiredPosts() {
  try {
    const now = new Date();

    const expiredPosts = await Post.updateMany(
      { expiration_dt: { $lt: now }, status: { $ne: "expired" } },
      { $set: { status: "Expired" } }
    );
    
  } catch (err) {
    console.error("Error checking for expired posts:", err);
  }
}

// Schedule the task every minute
cron.schedule('* * * * *', checkExpiredPosts);

app.listen(3000, ()=>{
    console.log('Server is running')
})