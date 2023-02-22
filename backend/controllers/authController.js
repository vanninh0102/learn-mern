const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

/**
 * @description Login
 * @route POST /auth
 * @access public
 */
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All field are required" });
    }

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const accessToken = createAccessToken(foundUser);

    const refreshToken = jwt.sign(
        {
            username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        // signed: true,
        secure: true, //https
        sameSite: "none", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expire: set to match refreshToken
    });

    res.json({ accessToken });
});

/**
 * @description Refresh
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @route GET /auth/refresh
 * @access public - because access token expired
 */
const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const foundUser = await User.findOne({
                username: decoded.username,
            });

            if (!foundUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const accessToken = createAccessToken(foundUser);
            return res.json({ accessToken });
        })
    );
};

/**
 * @description Logout
 * @route POST /auth/lougout
 * @access public - clear cookies if existed
 */
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No Content
    res.clearCookie("jwt");
    res.json({ message: "Cookie cleared" });
};

const createAccessToken = (user) => {
    return jwt.sign(
        {
            UserInfo: {
                username: user.username,
                roles: user.roles,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
    );
};

module.exports = {
    login,
    logout,
    refresh,
};
