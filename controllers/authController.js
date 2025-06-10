import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmPassword, skills, interests, experienceLevel, experienceSummary, github, linkedin, portfolio, bio } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = User.create({ fullname, username, email, password: hashedPassword,skills, interests, experienceLevel, experienceSummary, github, linkedin, portfolio, bio })
        // await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user });

    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export {
    register,
    login
}