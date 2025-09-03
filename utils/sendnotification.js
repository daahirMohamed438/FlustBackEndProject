const admin = require("./firebase"); // your initialized Firebase admin

const sendMonthlyDiscountNotification = async () => {
  const message = {
    notification: {
      title: "Monthly Discount",
      body: "This month we have a special discount for you!",
    },
    topic: "allUsers", // send to all subscribed users
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
module.exports = sendMonthlyDiscountNotification

 
