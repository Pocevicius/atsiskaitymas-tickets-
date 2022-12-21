const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  id: { type: String, required: false },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
    min: 6,
  },
  boughtTickets: { type: Array },
  moneyBalance: { type: Number, required: true },
});

module.exports = mongoose.model("user", usersSchema);
