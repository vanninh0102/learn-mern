const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get All User
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
        return res.status(400).json({ message: "No Users found" });
    }
    return res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // confirm data
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    // hash password
    const hashedPwd = bcrypt.hashSync(password, 10); //10: salt round

    const userObject =
        Array.isArray(roles) && roles.length
            ? { username, password: hashedPwd, roles }
            : { username, password, hashedPwd };

    //   create and store user
    const user = await User.create(userObject);

    if (user) {
        // created
        res.status(201).json({ message: `new user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data recieved" });
    }
});

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // Confirm data
    if (
        !id ||
        !username ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean"
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // check duplicate
    const duplicate = await User.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    // Allow updates to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        // Hash password
        user.password = bcrypt.hashSync(password, 10);
    }

    const updateUser = await user.save();

    return res.json({ message: `${updateUser.username} uupdated` });
});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "User ID required" });
        }

        const notes = await Note.find({ user: id }).lean().exec();
        if (Array.isArray(notes) && notes.length) {
            return res.status(400).json({ message: "User has assgined notes" });
        }

        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const result = await user.deleteOne();

        const reply = `Username ${result.username} with ID ${result._id} deleted`;
        return res.json(reply);
    } catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
};
