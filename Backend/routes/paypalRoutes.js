// routes/paypalRoutes.js
const express = require("express");
const { createOrder, capturePayment } = require("../services/paypalService");
const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { total } = req.body;
    const order = await createOrder(total);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/capture-payment", async (req, res) => {
  try {
    const { orderId } = req.body;
    const capture = await capturePayment(orderId);
    res.json(capture);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
