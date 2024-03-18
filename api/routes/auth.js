
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/register', async (req,res) => {
    const {username,password,email} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    try {
        const newUser = new User({username, password: hashedPassword,email});
        await newUser.save();
        res.json({message: 'User registred successfully'});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if(!user) {
        return res.status(401).json({message: 'Wrong username or password'});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid) {
        return res.status(401).json({message: 'Wrong username or password'});
    }

    const token = jwt.sign({userId: user._id}, 'your-secret-key', {expiresIn: '1h'});
    res.json({token});
})

module.exports = router;