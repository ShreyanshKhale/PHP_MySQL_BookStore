const express = require("express")
const { cart } = require("../models/datamodels")
//const modelNames = require("mongoose")
const router = express.Router()
const schema = require("../models/datamodels")
const q = require("q")


// user validation
router.post('/validateUser', (req, res) => {
    const q11 = schema.member.findOne({'userName' : req.body.username}, ['userName', 'password'])
    .then(d => {
        console.log(d)
        console.log(req.body)
        if(req.body.password == d.password){
            res.json({
                status : true,
                message : "user validated"
            })
        }
        else{
            res.json({
                status : false,
                message : "user not validated, try again"
            })
        }
    })
})

// Add member (user registration)
router.post('/addMember', (req, res) => {
    console.log(req)
    const member = new schema.member({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        userName : req.body.userName,
        email : req.body.email,
        password : req.body.password,
        memberCategory : req.body.memberCategory,
        address : req.body.address
    })
    member.save()
    .then(data => {
        var memberCart = new schema.cart({
            member : member.userName,
            booklist : []
        })
        memberCart.save()
        .then(cartData => {
            res.json({
                member : data,
                cart : cartData
            })
        })

    })
    .catch(err => {
        res.json(err)
    })
})

// Add book (Admin privilege)
router.post('/addBook', (req, res) => {
    console.log(req.body)
    const book = new schema.book({
        bookname : req.body.bookname,
        stock : req.body.stock,
        price : req.body.price,
        image : req.body.image,
        author : req.body.author,
        genre : req.body.genre
    })
    book.save()
    .then(data => {
        res.json(data)
        console.log(res)
    })
    .catch(err => {
        res.json(err)
    })
})

// Read all member
router.get('/fetchMember', (req, res) => {
    const users = schema.member.find(req.body)
    .then(data => { 
        console.log(data);
        res.json(data);
    })
    .catch(err => {
        console.log(err);
    });
})

// Read book
router.get('/fetchBook', (req, res) => {
    const users = schema.book.find(req.body)
    .then(data => { 
        res.json(data);
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
})

// Find the stock of the book
router.get('/findStock', (req, res) => {
    var bookInfo = {
        memberCategory : "",
        minstock : "",
        bookstock : ""
    }

    console.log(req.body)
    const users = schema.book.findOne(req.body)
    .then(data => { 
        res.json(data);
        bookInfo.bookstock = data.stock
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });
})

//find member category
router.get('/findMemberCategory', (req, res) => {
    console.log(req.body)
    var users = schema.member.findOne(req.body, 'memberCategory')
    .then(data => { 
        console.log(data.memberCategory)
        bookInfo.memberCategory = data.memberCategory
    })
    .catch(err => {
        console.log(err);
    });

    console.log(bookInfo)
    
})

//Add to cart (user privilege)
router.post('/addToCart', (req, res) => {
    console.log(req.body)
    var obj = {}
    obj.member = req.body.username

    const q1 = schema.book.findOne({'bookname' : req.body.bookname}, "stock")
    .then(data => { 
        console.log(data)
        obj.bookstock = data.stock
        console.log("143");
        console.log(data);

        const q2 =  schema.member.findOne({'username' : req.body.username}, 'memberCategory')
        .then(data => { 
            console.log(data.memberCategory)
            console.log("149");
            obj.memberCategory = data.memberCategory
            const q3 =  schema.category.findOne({'categoryName' : obj.memberCategory}, 'minStock')
            .then(data => {
                obj.minstock = data.minStock

                if(obj.bookstock > obj.minstock){
                    const q4 = schema.book.findOne({'bookname' : req.body.bookname})
                    .then(book => { 
                        console.log(32434431)
                        console.log(book)
                        
                        const q5 = schema.cart.findOne({'member' : obj.member}, 
                        // {$push:{'booklist' : d}}
                        )
                        .then(d => {
                            console.log(d)
                            d.booklist.push(book)
                            d.save()
                            console.log("updated")
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });

                    res.json({
                        message : `Book added to cart successfully <br> (The selected member is of Categpry:${obj.memberCategory}`
                    });

                    var logQuery = new schema.logData({
                        operation : "Add Book to cart",
                        timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                        status : "success"
                    })
                    logQuery.save()
                }
                else{
                    res.json({
                        message : "Book is out of stock"
                    });

                    var logQuery = new schema.logData({
                        operation : "Add book to cart",
                        timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                        status : "failure"
                    })
                    logQuery.save()
                }
            })
        })
        .catch(err => {
            res.json({
                error : err
            })
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
    
})

// display cart books
router.post("/displayCart", (req, res) => {
    console.log(req.body)
    const q5 = schema.cart.findOne({'member' : req.body.username}, 'booklist')
    .then(d => {
        let idlist = []
        console.log(d.booklist);
        d.booklist.forEach(ele => {
            idlist.push(ele._id);
        })
        console.log(idlist)
        const q6 = schema.book.find().where('_id').in(idlist)
        .then(d => {
            res.json({
                user : req.body.username,
                booklist : d
            })

            var logQuery = new schema.logData({
                operation : "Display Cart",
                timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                status : "success"
            })
            logQuery.save()
        })
    })
})

//shipping details
router.post("/shippingDetails", (req, res) => {
    const q7 = schema.member.findOne({"username" : req.body.username},"address")
    .then(d => {
        res.json({
            username : d.username,
            address : d.address
        })

        var logQuery = new schema.logData({
            operation : "Shipping Details",
            timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
            status : "success"
        })
        logQuery.save()
    })
})

// wallet calculation
router.post("/walletEstimate", (req, res) => {
    let obj = {
        username : req.body.username,
        category : "",
        discount: "",
        wallet : "",
        price : "",
        discountedPrice : ""
    }

    const q8 =  schema.member.findOne({'username' : req.body.username}, ['wallet', 'memberCategory'])
    .then(d => {
        obj.wallet = d.wallet
        obj.category = d.memberCategory
        console.log(obj)
        const q9 =  schema.category.findOne({'categoryName' : obj.category}, 'discount')
        .then(d => {
            obj.discount = d.discount
            console.log(obj)

            const q10 = schema.cart.findOne({'member' : req.body.username}, 'booklist')
            .then(d => {
                let price = 0

                let idlist = []
                d.booklist.forEach(ele => {
                    idlist.push(ele._id);
                })

                const q11 = schema.book.find({},'price').where('_id').in(idlist)
                .then(d => {
                    d.forEach(e => {
                        price = price + parseInt(e.price)
                    })
                    obj.price = price

                    obj.discountedPrice = obj.price*(1 - (obj.discount/100))

                    obj.wallet = obj.wallet - obj.discountedPrice

                    if(obj.wallet - obj.discountedPrice
                        > 0){
                        res.json({
                            totalCost : obj.discountedPrice,
                            wallet : obj.wallet,
                            message : "Enough wallet amount"
                        })
                    }
                    else{
                        res.json({
                            totalCost : obj.discountedPrice,
                            wallet : obj.wallet,
                            message : "Insufficient wallet amount"
                        })
                    }
                    console.log(obj)

                    var logQuery = new schema.logData({
                        operation : "Wallet Estimation",
                        timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                        status : "success"
                    })
                    logQuery.save()
                })

                // console.log()
                // d.booklist.forEach(ele => {
                //     price = price + parseInt(ele.price)
                //     console.log(ele.price)
                // })
                // obj.price = price
                // console.log(obj)
            })
        })
    })
})

// display order details
router.post("/displayOrderDetails", (req, res) => {
    let obj = {
        username : req.body.username,
        category : "",
        discount: "",
        wallet : "",
        price : "",
        discountedPrice : "",
        booknamelist : []
    }

    const q12 =  schema.member.findOne({'username' : req.body.username}, ['wallet', 'memberCategory', 'address'])
    .then(d => {
        obj.wallet = d.wallet
        obj.category = d.memberCategory
        console.log(obj)
        const q13 =  schema.category.findOne({'categoryName' : obj.category}, 'discount')
        .then(d => {
            obj.discount = d.discount
            console.log(obj)

            const q14 = schema.cart.findOne({'member' : req.body.username}, 'booklist')
            .then(d => {
                let price = 0

                let idlist = []
                d.booklist.forEach(ele => {
                    idlist.push(ele._id);
                })

                const q15 = schema.book.find({},'price').where('_id').in(idlist)
                .then(d => {
                    d.forEach(e => {
                        price = price + parseInt(e.price)
                    })
                    obj.price = price

                    obj.discountedPrice = obj.price*(1 - (obj.discount/100))

                    obj.wallet = obj.wallet - obj.discountedPrice


                    const q16 = schema.cart.findOne({'member' : req.body.username}, 'booklist')
                    .then(d => {
                        let idlist = []
                        console.log(d.booklist);
                        d.booklist.forEach(ele => {
                            idlist.push(ele._id);
                        })
                        console.log(idlist)
                        const q6 = schema.book.find().where('_id').in(idlist)
                        .then(d => {
                            d.forEach(e => {
                                obj.booknamelist.push({
                                    bookname: e.bookname,
                                    author: e.author,
                                    price: e.price
                                })
                            })
                            

                            console.log(obj)
                            res.json(obj)

                            var logQuery = new schema.logData({
                                operation : "Order Details",
                                timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                                status : "success"
                            })
                            logQuery.save()
                        })
                    })
                    
                })
            })
        })
    })
})

// place order
router.post("/placeOrder", (req, res) => {
    let obj = {
        username : req.body.username,
        category : "",
        discount: "",
        wallet : "",
        price : "",
        discountedPrice : "",
        booknamelist : []
    }

    const q17 =  schema.member.findOne({'username' : req.body.username}, ['wallet', 'memberCategory'])
    .then(d => {
        obj.wallet = d.wallet
        obj.category = d.memberCategory
        console.log(obj)
        const q18 =  schema.category.findOne({'categoryName' : obj.category}, 'discount')
        .then(d => {
            obj.discount = d.discount
            console.log(obj)

            const q19 = schema.cart.findOne({'member' : req.body.username}, 'booklist')
            .then(d => {
                let price = 0
                
                let idlist = []
                d.booklist.forEach(ele => {
                    idlist.push(ele._id);
                })
                obj.booknamelist = idlist

                const q20 = schema.book.find({},['price', '_id', 'stock']).where('_id').in(idlist)
                .then(d => {
                    d.forEach(e => {
                        price = price + parseInt(e.price)
                    })
                    obj.price = price

                    obj.discountedPrice = obj.price*(1 - (obj.discount/100))

                    obj.wallet = obj.wallet - obj.discountedPrice

                    const q21 = schema.member.findOne({'userName' : obj.username})
                    .then(d => {
                        d.wallet = obj.wallet;
                        d.save()


                        const q22 = schema.book.find({}, ['stock']).where('_id').in(obj.booknamelist)
                        .then(d => {
                            console.log(d);
                            d.forEach(ele => {
                                ele.stock = ele.stock - 1
                                ele.save()
                            })
                           

                            const q22 = schema.cart.findOne({'member' : req.body.username})
                            .then(d => {
                                console.log(d.booklist)
                                d.booklist = []
                                d.save()

                                var logQuery = new schema.logData({
                                    operation : "Place Order",
                                    timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
                                    status : "success"
                                })
                                logQuery.save()
                            })
                            
                        })
                    })
                    // console.log(obj)
                })
            })
        })
    })

    res.json({
        message : "Order Placed..."
    })
})

// add wallet money
router.post('/addWalletMoney', (req, res) => {
    console.log("add wallet money")
    console.log(req.body)
    const q24 = schema.member.findOne({'userName' : req.body.username}, "wallet")
    .then(d => {
        console.log(d)
        d.wallet = d.wallet + parseInt(req.body.money)
        d.save()
        res.json({
            message : `Rs. ${req.body.money} added to wallet`
        })

        var logQuery = new schema.logData({
            operation : "Add Wallet Money",
            timestamp : new Date().toISOString().replace(/T/, " ").replace(/\..+/, " "),
            status : "success"
        })
        logQuery.save()
    })
})

module.exports = router