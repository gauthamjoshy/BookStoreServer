const express = require("express")
const { registerController, loginController, updateUserProfileController, getAllBooksAdminController, getAllUsersAdminController, updateAdminProfileController, googleLoginController } = require("./controller/userController")
const { addBookController, getHomeBooksController, getAllBooksController, getAbookController, getUserBooksController, deleteUserBookController, getUserbroughtBookController, updateBookController, makeBookPaymentController } = require("./controller/bookController")

const jwtMiddleware = require("./middlewares/jwtMiddleware")
const multerConfig = require("./middlewares/imageMulterMiddleware")
const adminjwtMiddleware = require("./middlewares/adminjwtMiddleware")

const router = express.Router()

//REGISTER
router.post("/register", registerController)

//login
router.post("/login", loginController)

// google login
router.post(`/google-login`, googleLoginController)

//get homeBooks
router.get("/home-books", getHomeBooksController)

//  ----------------    users   ---------------

//add book
router.post("/add-book", jwtMiddleware, multerConfig.array("uploadImages", 3) , addBookController)
 
//  get all books
router.get("/all-books", jwtMiddleware, getAllBooksController)

// get a book
router.get(`/view-books/:id`, jwtMiddleware, getAbookController)

// get user added books
router.get(`/user-books`, jwtMiddleware, getUserBooksController)

// delete user added books
router.delete(`/delete-book/:id` , deleteUserBookController)

// get user brought books
router.get(`/brought-books`, jwtMiddleware, getUserbroughtBookController)

// update user profile
router.put(`/update-user-profile`, jwtMiddleware,multerConfig.single("profile"),  updateUserProfileController)



// ---------------------    admin   ---------------------

// get all book at admin side
router.get("/get-allbooks", getAllBooksAdminController)

// update book
router.put("/update-book/:id", updateBookController)

// get all users
router.get("/get-allusers", adminjwtMiddleware, getAllUsersAdminController)

// update admin profile
router.put(`/update-admin-profile`, adminjwtMiddleware, multerConfig.single("profile"), updateAdminProfileController)

// make payment
router.put("/make-payment", jwtMiddleware, makeBookPaymentController)


module.exports = router