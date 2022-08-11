import { Router } from "express";
import bcrypt from "bcrypt";
import User from '../models/User.js';
import auth from "../middleware/auth.js";
import tokensController from '../controllers/tokensController.js'
import refresh from "../middleware/refreshToken.js";
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
        if (!user) {
            return res.status(404).send('User not found');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Wrong password');
        }
        const token = await tokensController.access.create({ id: user._id });
        user.password = undefined;
        res.set("Authorization", token);
        res.status(200).send({ user, token });
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }

})

router.post('/logout', [auth], async (req, res) => {
    try {
        const token = req.token;
        await tokensController.access.expires(token);
        res.status(204).send();
    } catch (error) {
        console.log(error)
        res.status(400).send("An error has been ocurried")
    }
})


router.post('/refresh_token', [refresh]);

export default router;