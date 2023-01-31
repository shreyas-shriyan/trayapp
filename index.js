const { io } = require("socket.io-client");
const notifier = require("node-notifier");
const path = require("path");
const sound = require("sound-play");
const figlet = require("figlet");

const SOCKET_SERVER = "https://api.riskmatic.shreyas.work";
const CLIENT_URL = "https://riskmatic.shreyas.work";

const notify = ({ title, message, openUrl }) => {
  try {
    notifier.notify({
      title,
      message,
      icon: path.join(__dirname, "assets/lythouse.png"), // Absolute path (doesn't work on balloons)
      open: openUrl,
    });
  } catch (error) {
    console.log(error)
  }
};

const log = (text) => {
  console.clear()

  figlet.text(text, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default"
  }, function (err, data) {
    if (err) {
      console.error("Something went wrong...");
      console.error(err);
      return;
    }
    if (text == "Connected") {
      console.log(`\x1b[32m${data}\x1b[0m`);
    } else {
      console.log(`\x1b[31m${data}\x1b[0m`)
    }
  });
}

const socket = io(`${SOCKET_SERVER}/report-incident`);

socket.on("connect", () => {
  log("Connected")

  notify({
    title: "Riskmatic",
    message: "Connected with Riskmatic",
  });
});

socket.on("disconnect", () => {
  log("disconnected"); // false
});

socket.on("initiated", async () => {
  const soundFile = path.join(__dirname, "./assets/ambulanceSiren.wav")

  sound.play(soundFile, 1); //file,volume

  notify({
    title: "Riskmatic SOS",
    message: "Please click here to check dashboard.",
    openUrl: `${CLIENT_URL}/sosDashboard`,
  });
});
