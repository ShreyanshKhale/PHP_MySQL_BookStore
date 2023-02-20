const mongoose = require("mongoose")

const addressTemplete = mongoose.Schema({
    firstLine : {
        type : String,
        required : true
    },
    secondLine : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    }, 
    country: {
        type : String,
        required : true
    },
    pincode: {
        type : Number,
        required : true
    }
})

//schema for member collection
const memberTemplate = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    lastName : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    userName : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    email : {
        type : String,
        required : true,
        lowercase : true
        // validate: [
        //     {validator : validators.notEmpty, msg : "Email is empty"},
        //     {validator : validators.isEmail, msg : "Invalid Email"}
        // ]
    },
    password : {
        type : String,
        required : true
    }, 

    address : {
        type : addressTemplete,
        required : true
    },

    memberCategory : {
        type : String,
        required : true
    },
    wallet : {
        type : Number,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    }
})

// schema for admin user
const operatorTemplate = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    lastname : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    username : {
        type : String,
        required : true,
        // validate: [validators.notEmpty, 'Name is empty']
    },
    email : {
        type : String,
        required : true,
        lowercase : true
        // validate: [
        //     {validator : validators.notEmpty, msg : "Email is empty"},
        //     {validator : validators.isEmail, msg : "Invalid Email"}
        // ]
    },
    password : {
        type : String,
        required : true
    }
})

// schema for user categories
const categoryTemplate = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true,
    },
    discount : {
        type : Number,
        required : true
    },
    minStock : {
        type : Number,
        required : true
    }
})

// schema for book collection
const bookTemplate = new mongoose.Schema({
    bookname : {
        type : String,
        required : true,
    },
    stock : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
    author : {
        type : String,
        required : true
    }, 
    genre : {
        type : String,
        required : true
    }
})

// schema for cart
const cartTemplate = new mongoose.Schema({
    member : {
        type : String,
        required : true,
    },
    booklist : {
        type : [{
            book : {
                type : bookTemplate
            }
        }],
        required : true,
    },
    
})

// schema for log collection
const logTemplate = new mongoose.Schema({
    operation : {
        type : String,
        required : true,
    },
    timestamp : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        required : true,
    },
    
})

const member = mongoose.model('member', memberTemplate)
const operator = mongoose.model('operator', operatorTemplate)
const category = mongoose.model('category', categoryTemplate)
const book = mongoose.model('book', bookTemplate)
const cart = mongoose.model('cart', cartTemplate)
const logData = mongoose.model('logdata', logTemplate)

module.exports = {
    book : book,
    member : member,
    category : category,
    book : book,
    operator : operator,
    cart : cart,
    logData : logData
}

