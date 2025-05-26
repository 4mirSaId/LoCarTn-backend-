const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Agency = require("../models/Agency");
const Client = require("../models/Client");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
    const {role} = req.body;
    const {name, licenseNumber, email, password, phone} = req.body;
    try {
        let Model;
        if (role === "client") {
            Model = Client;
        } else if (role === "agency") {
            Model = Agency;
        } else if (role === "admin") {
            Model = Admin;
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

        const token = jwt.sign({ id: user._id, role: user.role, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1d" });

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
    const {email, password} = req.body;

    try {
        let user = await Client.findOne({ email });
        let role = 'client';
        if (!user) {
            user = await Agency.findOne({ email });
            role = 'agency';
        }
        if (!user) {
            user = await Admin.findOne({ email });
            role = 'admin';
        }
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Add phone to JWT payload for clients
        const tokenPayload = { id: user._id, role: user.role };
        if (role === 'client') tokenPayload.phone = user.phone;
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

        // After finding the user and before sending the response:
        const userObj = user.toObject();
        userObj.id = user._id; // always set id
        if (role === 'agency') {
            userObj.agencyId = user._id; // for agencies, set agencyId
        }

        res.json({
            token,
            role: user.role,
            agencyId: user.agencyId || user._id,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};