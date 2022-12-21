const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../model/users");

module.exports.SIGN_UP = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new userSchema({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    boughtTickets: [],
    moneyBalance: req.body.moneyBalance,
  });
  // makes capital letter
  const capsName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  userSchema.updateOne((user.name = capsName));
  // makes tokens
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
    { algorithm: "RS256" }
  );
  const tokenRefresh = jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
    { algorithm: "RS256" }
  );

  user
    .save()
    .then((result) => {
      return res.status(200).json({
        response: "User was created successfully",
        user: result,
        jwt_token: token,
        jwt_token_refresh: tokenRefresh,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ response: "Missing email or password is wrong" });
    });
};

module.exports.LOGIN = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        { algorithm: "RS256" }
      );
      const tokenRefresh = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        { algorithm: "RS256" }
      );

      return res.status(200).json({
        status: "login successful",
        jwt_token: token,
        jwt_token_refresh: tokenRefresh,
      });
    }
    return res
      .status(404)
      .json({ status: "login failed,incorrect email or password" });
  } catch (err) {
    console.log("req.body", req.body);

    console.log("err", err);
    return res
      .status(404)
      .json({ status: "login failed,incorrect email or password" });
  }
};

module.exports.GET_NEW_JWT_TOKEN = (req, res) => {
  const refreshToken = req.headers.refresh;
  console.log(refreshToken);

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log("decoded", decoded);
    if (err) {
      return res
        .status(400)
        .json({ message: "Unauthorized,session expired you need to login" });
    } else {
      const token = jwt.sign(
        {
          email: decoded.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
        { algorithm: "RS256" }
      );
      return res.status(200).json({ new_token: token });
    }
  });
};

module.exports.GET_ALL_USERS = async (req, res) => {
  const data = await userSchema.find().sort("name");

  console.log(data);

  return res.status(200).json({ users: data });
};

module.exports.GET_USER_BY_ID = async (req, res) => {
  const user = await userSchema
    .findOne({ _id: req.params.id })
    .then((result) => {
      return res.status(200).json({ user: result });
    })
    .catch((err) => {
      console.log("err", err);
      res
        .status(404)
        .json({ response: "The user ID you entered does not exist" });
    });
};
