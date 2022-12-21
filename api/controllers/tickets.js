const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const ticketsSchema = require("../model/tickets");
const usersSchema = require("../model/users");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.CREATE_TICKET = (req, res) => {
  const newTicket = new ticketsSchema({
    title: req.body.title,
    ticketPrice: req.body.ticketPrice,
    fromLocation: req.body.fromLocation,
    toLocation: req.body.toLocation,
    toLocationPhotoUrl: req.body.toLocationPhotoUrl,
  });
  newTicket.save().then(() => {
    res.status(200).json({
      statusMessage: "ticket added successfully",
      ticket: newTicket,
    });
  });
};

module.exports.BUY_TICKET = async (req, res) => {
  const ticket = await ticketsSchema.findOne({ _id: req.params.id });
  const wallet = await usersSchema
    .findOne({ _id: req.body.id })
    .then((result) => {
      console.log(result.moneyBalance);
      return result.moneyBalance;
    });
  const balanceAfterPurchase = wallet - ticket.ticketPrice;
  if (ticket.ticketPrice < wallet) {
    usersSchema
      .updateOne(
        { _id: req.body.id },
        {
          moneyBalance: balanceAfterPurchase,
          $push: { ticketsBought: ticket._id },
        }
      )
      .exec()
      .then((result) => {
        return res.status(200).json({
          statusMessage: "Ticket purchased",
          moneyBalanceLeft: balanceAfterPurchase,
        });
      });
  } else {
    return res.status(400).json({ statusMessage: "Ticket purchase failed" });
  }
};
