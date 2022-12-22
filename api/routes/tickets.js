const express = require("express");
const router = express.Router();
const {
  CREATE_TICKET,
  BUY_TICKET,
  GET_USER_BY_ID_WITH_TICKETS,
  GET_ALL_USERS_WITH_TICKETS,
} = require("../controllers/tickets");
const auth = require("../middleware/auth");

router.post("/createTicket", CREATE_TICKET);

router.post("/buyTicket/:id", auth, BUY_TICKET);

router.get("/getUserByIdWithTickets/:id", auth, GET_USER_BY_ID_WITH_TICKETS);

router.get("/getAllUsersWithTickets", auth, GET_ALL_USERS_WITH_TICKETS);

module.exports = router;
