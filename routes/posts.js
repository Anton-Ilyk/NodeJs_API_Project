const express = require('express')
const router = express.Router()

const {postValidation} = require('../validations/validation')

const Post = require('../models/Posts')
const Like = require('../models/Likes')
const Dislike = require('../models/Dislikes')
const Comment = require('../models/Comments')

const verifyToken = require('../verifyToken')

// Create a post
router.post('/create-post', verifyToken, async(req,res) =>{
    
    // Validation to check post data
    const {error} = postValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    //Checking if user wants to use custom expiration time or the default one(12 hours)
    let post = ""
    const customDate = req.body.expiration_dt ? true : false;
    if(customDate){
        expDt = Date.now() + Number(req.body.expiration_dt) * 60 * 1000

        post = new Post({
            title:req.body.title,
            topics:req.body.topics,
            data:req.body.data,
            expiration_dt: expDt,
            owner: req.user.username
    })}
    else{
        post = new Post({
            title:req.body.title,
            topics:req.body.topics,
            data:req.body.data,
            owner: req.user.username
    })}

    // Save post
    try{
        const savedPost = await post.save()
        res.send(savedPost)
    }catch(err){
        res.status(400).send({message:err})
    }
    
})

// View all posts
router.get('/view-all', verifyToken, async(req,res) =>{
    
    try{
        const getPosts = await Post.find().limit(100)
        res.send(getPosts)
    }catch(err){
        res.status(400).send({message:err})
    }

})

// View specific post
router.get('/view/:post_id', verifyToken, async(req,res) =>{
    
    try{
        const post_id = Number(req.params.post_id);
        const getPostById = await Post.findOne({ post_id: post_id });

        res.send(getPostById)
    }catch(err){
        res.status(400).send({message:err})
    }

})

// View specific post with all the comments, likes and dislikes
router.get('/post-details/:post_id', verifyToken, async (req, res) => {
    
    const post_id = Number(req.params.post_id);
    try {

    const post =  await Post.findOne({ post_id: post_id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post_id: post_id });
    const likes = await Like.find({ post_id: post_id});
    const dislikes = await Dislike.find({ post_id: post_id});

    // Combine the data into one response object
    const response = {
      post,
      comments,
      likes,
      dislikes
    };

    // Send the combined response
    res.send(response);
  } catch (err) {
    return res.status(400).send({message:err})
  }

})

// Search posts by specific criterias
router.post('/posts-by-criteria', verifyToken, async (req, res) => {

  //Retrieving data from body and creating query
  const status = req.body.status ? req.body.status : "Live"
  const topics = req.body.topics 
  const topicArray = topics ? topics.split(',') : []; 

  const query = {};
  if (topicArray.length > 0) query.topics = { $in: topicArray };  
  if (status) query.status = status;  

  //Retrieving data from MongoDB
  try {
    const posts = await Post.find(query);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found with the given filters' });
    }

    res.send(posts);
  } catch (err) {
    return res.status(400).send({message:err})
  }

})

//Retrieve top posts by topic
router.post('/top-posts', verifyToken, async (req, res) => {
  
   const sort_by = req.body.sort_by
   if (sort_by !== "comments" && sort_by !== "likes" && sort_by !== "dislikes") {
       return res.status(404).json({ message: 'You need to chose how you`d live to sort posts. By "comments", "likes" or "dislikes"' });
    }

  try {
    const posts = await Post.find({ topics: {$in: req.body.topic }})
      .sort({ [sort_by]: -1 })
      .limit(1);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found with the given filters' });
    }

    res.send(posts);
  } catch (err) {
    return res.status(400).send({message:err})
  }

})

//Like post
router.post('/like/:post_id', verifyToken, async(req,res) =>{

    //Check if post/user meets all the criterias for any action
    const outcome = await validatePostAction(req.user.username, req.params.post_id, "like")
    if (outcome !== "Action can be completed!") {
       return res.status(400).json({ message: outcome });
    }
    
    //Update Likes table
    const like = new Like({
        post_id:req.params.post_id,
        username:req.user.username
    })

    try{
        const newLike = await like.save()
    }catch(err){
        return res.status(400).send({message:err})
    }

    //Add like to the post
    try{
        const post_id = Number(req.params.post_id);
        const updatePostById = await Post.updateOne(
            {post_id: Number(req.params.post_id)},
            {$inc: { likes: 1 }}
        )
        res.send(updatePostById)
    }catch(err){
        return res.status(400).send({message:err})
    }

})

//Dislike post
router.post('/dislike/:post_id', verifyToken, async(req,res) =>{

    //Check if post/user meets all the criterias for any action
    const outcome = await validatePostAction(req.user.username, req.params.post_id, "dislike")
    if (outcome !== "Action can be completed!") {
       return res.status(400).json({ message: outcome });
    }

    //Update Dislikes table
    const dislike = new Dislike({
        post_id:req.params.post_id,
        username:req.user.username
    })

    try{
        const newDislike = await dislike.save()
    }catch(err){
        return res.status(400).send({message:err})
    }

    //Add dislike to the post
    try{
        const post_id = Number(req.params.post_id);
        const updatePostById = await Post.updateOne(
            {post_id: Number(req.params.post_id)},
            {$inc: { dislikes: 1 }}
        )
        res.send(updatePostById)
    }catch(err){
        return res.status(400).send({message:err})
    }

})

//Comment post
router.post('/comment/:post_id', verifyToken, async(req,res) =>{

    //Check if post/user meets all the criterias for any action
    const outcome = await validatePostAction(req.user.username, req.params.post_id, "comment")
    if (outcome !== "Action can be completed!") {
       return res.status(400).json({ message: outcome });
    }
   
    //Update Comments table
    const comment = new Comment({
        post_id:req.params.post_id,
        username:req.user.username,
        comment: req.body.comment
    })

    try{
        const newComment = await comment.save()
    }catch(err){
        return res.status(400).send({message:err})
    }

    //Add comment to the post
    try{
        const post_id = Number(req.params.post_id);
        const updatePostById = await Post.updateOne(
            {post_id: Number(req.params.post_id)},
            {$inc: { comments: 1 }}
        )
        res.send(updatePostById)
    }catch(err){
        return res.status(400).send({message:err})
    }

})

//Check if we can like/dislike/comment post(based on project requirements)
async function validatePostAction(username, post_id, action) {
    
    //Check if post exists
    const existsPost = await Post.findOne({
        post_id: Number(post_id)
    });
    const postFound = existsPost ? true : false;

    if(!postFound){
       return "You can't like non-existing post!"
    }

    //Check if user already like/disliked/commented this post
    const existsLike = await Like.findOne({
        post_id: Number(post_id),
        username: username
    });
    const isFoundLike = existsLike ? true : false;
    
    const existsDislike = await Dislike.findOne({
        post_id: Number(post_id),
        username: username
    });
    const isFoundDislike = existsDislike ? true : false;

    //const existsComment = await Comment.findOne({ - Can be enabled if we want to restrict each user 1 comment per post
    //    post_id: Number(post_id),
    //    username: username
    //});
    //const commentFound = existsComment ? true : false;

    if(isFoundDislike && action === "dislike"){
       return "You already disliked this post!"
    }
    if(isFoundLike && action === "like"){
       return "You already liked this post!"
    }
    //if(commentFound){ - Can be enabled if we want to restrict each user 1 comment per post
    //   return "You already commented this post!"
    //}

    //Check if post is still Live
    const expiredPost = await Post.findOne({
        post_id: Number(post_id),
        status: "Expired"
    });
    const expired = expiredPost ? true : false;

    if(expired){
       return "You can't like, dislike or comment expired posts!"
    }

    //Check if user is a post owner 
    const ownerPost = await Post.findOne({
        post_id: Number(post_id),
        owner: username

    });
    const owners = ownerPost ? true : false;

    if(owners){
       return "You can't like, dislike or comment your own posts!"
    }
    
    return "Action can be completed!"
    
}

module.exports = router