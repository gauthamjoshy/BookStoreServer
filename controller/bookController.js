const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.StripeSecretKey);

exports.addBookController = async (req, res) => {
    console.log("Inside Book controller");
    // book
    const { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category } = req.body
    console.log(title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category);

    // to see image
    // console.log(req.files);
    // const uploadImages = req.files
    // console.log(uploadImages);

    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))
    console.log(uploadImages);

    const userMail = req.payload
    console.log(userMail);

    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json(`Book already added...!`)
        } else {
            const newBook = new books({
                title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    }
    catch (error) {
        res.status(500).json(error)
    }

}

// get home books
exports.getHomeBooksController = async (req, res) => {
    console.log(`Inside home book controller`);
    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

//  get all-books - user side
exports.getAllBooksController = async (req, res) => {
    console.log(`Inside all book controller`);
    // console.log(req.query.search);
    const searchKey = req.query.search
    const userMail = req.payload

    // search logic
    const query = {
        title: { $regex: searchKey, $options: "i" },
        userMail: { $ne: userMail }
    }


    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// get a book
exports.getAbookController = async (req, res) => {
    console.log('Inside getAbookController');

    // console.log(req.params);
    const { id } = (req.params)
    console.log(id);

    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }


    res.status(200).json(`get a book request`)
}


//  user added - books
exports.getUserBooksController = async (req, res) => {
    console.log(`Inside currentLoginUserBookController`);

    const userMail = req.payload

    try {
        const userBooks = await books.find({ userMail: userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete user added book
exports.deleteUserBookController = async (req, res) => {
    console.log(`Inside deleteUserBookController`);

    const { id } = (req.params)

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book deleted successfully`)
    } catch (error) {
        res.status(500).json(error)
    }

}

// get user brought books
exports.getUserbroughtBookController = async (req, res) => {
    console.log(`Inside getUserbroughtBookController`);

    const userMail = req.payload

    try {
        const broughtBooks = await books.find({ boughtBy: userMail })
        res.status(200).json(broughtBooks)


    } catch (error) {
        res.status(500).json(error)
    }
}

// update book status as approved
exports.updateBookController = async (req, res) => {
    console.log(`Inside updateBookController`);
    const { id } = req.params

    const updateBookData = { status: "approved" }
    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, updateBookData, { new: true })
        res.status(200).json(updateBook)
    } catch (error) {
        res.status(500).json(error)
    }

}


// make payment
// exports.makeBookPaymentController = async (req, res) => {
//     console.log(`Inside makeBookPaymentController`);

//     const { _id, title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, uploadImages, userMail } = req.body

//     const email = req.payload
//     console.log(email);


//     try {
//         const updateBookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, uploadImages, status: "sold", boughtBy: email, userMail }, { new: true })
//         // res.status(200).json(updateBookPayment)
//         console.log(updateBookPayment);

//         const line_items = [{
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: title,
//                     description: `${author} | ${publisher}`,
//                     images: [imageUrl],
//                     metadata: {
//                         title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, status: "sold", boughtBy: email, userMail
//                     }
//                 },
//                 unit_amount: Math.round(dPrice * 100)
//             },
//             quantity: 1
//         }]

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items,
//             mode: 'payment',
//             success_url: 'http://localhost:5173/payment-success',
//             cancel_url: "http://localhost:5173/payment-error"


//         });
//         console.log(session);
//         res.status(200).json({ checkoutSessionUrl: session.url })
//         // res.status(200).json(`Success response recieved`)



//     } catch (error) {
//     }


// }
exports.makeBookPaymentController = async (req, res) => {
    console.log(`Inside makeBookPaymentController`);

    const { _id, title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, userMail } = req.body

    const email = req.payload
    console.log(email);


    try {
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, {status: "sold", boughtBy: email }, { new: true })
        // res.status(200).json(updateBookPayment)
        console.log(updateBookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: {
                        title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, languages, isbn, category, status: "sold", boughtBy: email, userMail
                    }
                },
                unit_amount: Math.round(dPrice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: "http://localhost:5173/payment-error"
            success_url: 'https://book-store-frontend-ten-sandy.vercel.app/payment-success',
            cancel_url: "https://book-store-frontend-ten-sandy.vercel.app/payment-error"


        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json(`Success response recieved`)



    } catch (error) {
    }


}
// exports.makeBookPaymentController = async (req, res) => {
//     console.log(`Inside makeBookPaymentController`);

//     const { _id, title, author, imageUrl, dPrice } = req.body;
//     const email = req.payload;

//     try {
//         // FIXED: await & only update what is needed
//         await books.findByIdAndUpdate(
//             _id,
//             {
//                 status: "sold",
//                 boughtBy: email
//             },
//             { new: true }
//         );

//         const line_items = [{
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: title,
//                     description: author,
//                     images: [imageUrl]
//                 },
//                 unit_amount: Math.round(dPrice * 100)
//             },
//             quantity: 1
//         }];

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items,
//             mode: 'payment',
//             success_url: 'http://localhost:5173/payment-success',
//             cancel_url: "http://localhost:5173/payment-error"
//         });

//         res.status(200).json({ checkoutSessionUrl: session.url });

//     } catch (error) {
//         res.status(500).json(error);
//     }
// };
