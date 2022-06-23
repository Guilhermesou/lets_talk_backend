import { Router } from "express";
import bcrypt from "bcrypt";
import User from '../models/User.js';

import tokensController from '../controllers/tokensController.js'
const router = Router();

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
        const token = tokensController.generateToken({ id: user._id });
        user.password = undefined;
        res.status(200).send({user, token});
    } catch (error) {
        res.status(500).send(error.message);
    }

})

router.post('/logout', async (req, res) => {
    try {
        const token = req.token;
        await tokensController.expiresTokenJWT(token);
        res.status(204).send();
    } catch (error) {
        res.status(400).send("An error has been ocurried")
    }
})

export default router;