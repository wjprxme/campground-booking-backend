const express = require('express');
const {getReviews, getReview, createReview, updateReview, deleteReview} = require('../controllers/reviews');
const router = express.Router({mergeParams: true});
const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getReviews)
    .post(protect, authorize('admin', 'user'), createReview);
router.route('/:id')
    .get(protect, getReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router; 

