const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      console.log(decoded.userId);
      req.body.userId = decoded.userId;
      next();
    } else {
      console.log("auth failed");
      return res.status(401).json({ message: "auth failed" });
    }
  });
};
