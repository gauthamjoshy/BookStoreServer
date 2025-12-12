const books = require("../model/bookModel");
const users = require("../model/userModel");
const jwt = require("jsonwebtoken")

//  register
exports.registerController = async (req, res) => {
    console.log("Inside register controller");
    const { username, email, password } = req.body
    console.log(username, email, password);

    // logic
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(404).json(`User Already Exist...Please Login...`)
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    } catch (error) {
        res.status(500).json(error)
    }

    // console.log(req);
    // res.status(200).send("Register request received")


}

//  login
exports.loginController = async (req, res) => {
    console.log("Inside login controller");
    const { email, password } = req.body
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey)
                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json('Invalid credentials')
            }
        } else {
            res.status(404).json(`User not found...Please register`)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// google login 
exports.googleLoginController = async (req, res) => {
    console.log("Inside googleLoginController");
    const { email, password, username, profile } = req.body
    console.log(email, password, username, profile);

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {

            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey)
            res.status(200).json({ existingUser, token })

        } else {
            const newUser = new users({
                username, email, password, profile
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email, role: existingUser.role }, process.env.JWTSecretKey)
            res.status(200).json({ existingUser: newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}



// update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log(`Inside updateUserProfileController`);

    const { username, password, bio, role, profile } = req.body
    const email = req.payload
    console.log(username, password, bio, role);

    const uploadProfile = req.file ? req.file.filename : profile
    console.log(uploadProfile);



    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, email, password, profile: uploadProfile, bio, role }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
}
// ---------------------    admin   ---------------------

// get all books
exports.getAllBooksAdminController = async (req, res) => {
    console.log(`Inside getAllBooksAdminController`);
    try {
        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// get all users admin 
exports.getAllUsersAdminController = async (req, res) => {
    const userMail = req.payload

    try {
        const allUsers = await users.find({ email: { $ne: userMail } })
        console.log(allUsers);
        res.status(200).json(allUsers)

    } catch (error) {
        res.status(500).json(error)
    }
}


// update admin profile controller
exports.updateAdminProfileController = async (req, res) => {
    console.log(`Inside updateAdminProfileController`);

    const { username, password, profile } = req.body
    const email = req.payload
    const role = req.role
    console.log(username, password, role);

    const uploadProfile = req.file ? req.file.filename : profile
    console.log(uploadProfile);



    try {
        const updateAdmin = await users.findOneAndUpdate({ email }, { username, email, password, profile: uploadProfile, role }, { new: true })
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
}