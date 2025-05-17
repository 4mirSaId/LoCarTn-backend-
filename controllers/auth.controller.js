const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Agency = require("../models/Agency");
const Client = require("../models/Client");

exports.register = async (req, res) => {
    const {role} = req.body;
    const {name, licenseNumber, email, password, phone} = req.body;
    try {
        let Model;
        if (role === "client") {
            Model = Client;
        } else if (role === "agency") {
            Model = Agency;
        } else {
            return res.status(400).json({message: "Invalid role"});
        }

        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Model({
            name,
            email,
            password: hashedPassword,
            phone,
            ...(role === "agency" && { licenseNumber })
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            token,
            role: user.role,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const {role} = req.body;
    const {email, password} = req.body;

    try {
        let Model;
        if (role === "client") {
            Model = Client;
        } else if (role === "agency") {
            Model = Agency;
        } else {
            return res.status(400).json({message: "Invalid role"});
        }

        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            token,
            role: user.role,
            message: "User logged in successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};