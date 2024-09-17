const PubNub = require("pubnub");
const User = require("../Backend/models/User");

const initPubNub = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const pubnub = new PubNub({
    publishKey: "pub-c-8f37cfad-919e-4519-9260-cb77907b1bf4",
    subscribeKey: "sub-c-81dc4665-6f4f-4788-bc47-18119277bf07",
    uuid: user._id.toString(), // Use user ID as uuid
  });

  return pubnub;
};

// Function to publish messages
const publishMessage = async (userId, message) => {
  try {
    const pubnub = await initPubNub(userId);
    const channel = `notifications-${userId}`;

    pubnub.publish(
      {
        channel: channel,
        message: message,
      },
      (status, response) => {
        if (status.error) {
          console.log("Publish error:", status);
        } else {
          console.log("Publish successful:", response);
        }
      }
    );
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};

module.exports = { initPubNub, publishMessage };
