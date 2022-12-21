const mongoose = require("mongoose");

const ticketsSchema = mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: true, min: 3 },
  ticketPrice: { type: Number, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  toLocationPhotoUrl: { type: String, required: true },
});

module.exports = mongoose.model("tickets", ticketsSchema);
