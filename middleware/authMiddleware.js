const jwt = require("jsonwebtoken");


const authMiddleware = (role = []) => {
    return (req, res, next) => {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden" });
            }

            if (role.length && !role.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            req.user = decoded;
            next();
        });
    }
}

const isAgency = async (req, res, next) => {
    if (req.user.role !== 'agency') {
        return res.status(403).json({message: 'Access denied: Not an agency'});
    }
    next();
};

const isClient = async (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({message: 'Access denied: Not an client'});
    }
    next();
};

const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({message: 'Access denied: Not ADMIN'});
    }
    next();
};

module.exports = {authMiddleware, isAgency, isClient, isAdmin};