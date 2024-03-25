const Review = require('../models/Review');
const Campground =require('../models/Campground');

// @desc    Get All Reviews
// @routes  GET /api/v1/reviews
// @access  Private
exports.getReviews = async (req, res, next) => {
    let query;
    // General users can see only their reviews!
    if (req.user.role !== 'admin') {
        query = Review.find({user: req.user.id}).populate({
            path: 'campground',
            select: 'name address telephoneNumber'
        });
    }
    else {
        // If you are an admin, you can see all review!
        if (req.params.campgroundId) {
            console.log(req.params.campgroundId);

            query = Review.find({campground: req.params.campgroundId}).populate({
                path: 'campground',
                select: 'name address telephoneNumber'
            });
        }
        else {
            query = Review.find().populate({
                path: 'campground',
                select: 'name address telephoneNumber'
            });
        }
    }
    try {
        const reviews = await query;
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }
    catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            success: false, 
            message: 'Cannot find review'
        });
    }
};


// @desc    Get Single Review
// @route   GET /api/v1/reviews:id
// @access  Private
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).populate({
            path: 'campground',
            select: 'name address telephoneNumber'
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: review
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find review'
        });
    }
}

// @desc    Create Single review
// @route   POST /api/v1/campgrounds/:campgroundId/review
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        req.body.campground = req.params.campgroundId;

        const campground = await Campground.findById(req.body.campground);

        if (!campground) {
            return res.status(404).json({
                success: false,
                message: `No campground with the id of ${req.params.campgroundId}`
            });
        }

        // Add userId to req.body
        req.body.user = req.user.id;

        // Check for existed review
        const existedReviews = await Review.find({user:req.user.id});

        // If the user is not an admin, they can only create 1 review.
        if (existedReviews.length >= 1 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false, 
                message : `The user with ID ${req.user.id} has already made 1 review`
            });
        }

        const review = await Review.create(req.body);

        res.status(200).json({
            success: true,
            data: review
        })
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Cannot create review'
        });
    }
}

// @desc    Update Single Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`
            });
        }

        // Make sure user is the review owner
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false, 
                message: `User ${req.user.id} is not authorized to update this review`
            })
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: review
        })
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Cannot update review'
        });
    }
}

// @desc    Delete Single review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: `No review with the id of ${req.params.id}`
            });
        }

        // Make sure user is the review owner
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false, 
                message: `User ${req.user.id} is not authorized to delete this review`
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Cannot delete review'
        });
    }
}