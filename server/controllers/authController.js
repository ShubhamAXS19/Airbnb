const bcrypt = require('bcryptjs');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        hashedPassword = await bcrypt.hash(password, 12);
        const userDoc = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(200).json({
            status: 'success',
            userDoc
        });
    } catch (e) {
        res.status(422).json(e);
    }

};

exports.login = async (req, res) => {
    console.log("HI")
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = await bcrypt.compare(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
                name: userDoc.name
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token)
                    .json(userDoc);
            });
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
};


exports.profile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
};




exports.logout = (req, res) => {
    res.cookie('token', '').json(true);
};
