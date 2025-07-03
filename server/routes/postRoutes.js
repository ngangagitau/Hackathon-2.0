const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

// No auth yet, so we leave routes unprotected for now
router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;
