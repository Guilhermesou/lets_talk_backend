import { Router } from "express";
import bcrypt from "bcrypt";

import User from '../models/User.js';
import jwt from "jsonwebtoken";

const router = Router();

function generateToken(params = {}) {
    return jwt.sign(
        { params },
        process.env.SECRET,
        { expiresIn: 400 }
    );
}


router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save(
            res.status(201).send(user.toJSON())
        );
    } catch (error) {
        res.status(500).send({ message: `${error.message} - can't create user.` })
    }

});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        !user && res.status(404).send('User not found');

        const validPassword = await bcrypt.compare(password, user.password);
        !validPassword && res.status(400).send('Wrong password');
        const token = generateToken({ id: user._id });
        user.password = undefined;
        res.status(200).send({user, token});
    } catch (error) {
        res.status(500).send(error.message);
    }

})

export default router;