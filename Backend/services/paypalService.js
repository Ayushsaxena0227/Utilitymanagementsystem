// services/paypalService.js
const paypal = require("@paypal/checkout-server-sdk");

const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

const createOrder = async (total) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    return order.result;
  } catch (err) {
    console.error(err);
    throw new Error("Error creating PayPal order");
  }
};

const capturePayment = async (orderId) => {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  try {
    const capture = await paypalClient.execute(request);
    return capture.result;
  } catch (err) {
    console.error(err);
    throw new Error("Error capturing PayPal payment");
  }
};

module.exports = { createOrder, capturePayment };
