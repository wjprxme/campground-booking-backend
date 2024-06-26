const mongoose = require('mongoose');

const CampgroundSchema = new mongoose.Schema({
    name : {
        type: String,
        required :[true, 'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50, 'Name can not be more than 50 characters'] 
    },
    description:{ 
        type: String,
        required: [true, 'Please add an description']
    },
    address:{ 
        type: String,
        required: [true, 'Please add an address']
    },
    province:{ 
        type: String,
        required: [true, 'Please add an province']
    },
    country:{ 
        type: String,
        required: [true, 'Please add an country']
    },
    postalcode:{ 
        type: String,
        required: [true, 'Please add an postalcode']
    },
    telephoneNumber:{
        type: String,
        required: [true, 'Please add a telephone number']
    },
    picture:{
        type: String,
        required: [true, 'Please add a picture url']
    }
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
);

// Reverse populate with virtuals
CampgroundSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'campground',
    justOne: false
});

// Cascade delete bookings when a campground is deleted
CampgroundSchema.pre('deleteOne', {document: true, query:false}, async function(next){
    console.log(`Bookings being removed from campground ${this._id}`);
    await this.model('Booking').deleteMany({campground: this._id});
    next();
});

module.exports= mongoose.model('Campground',CampgroundSchema);