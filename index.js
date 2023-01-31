const { io } = require("socket.io-client");
const notifier = require("node-notifier");
const path = require("path");
const sound = require("sound-play");

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


const socket = io(`${SOCKET_SERVER}/report-incident`);

socket.on("connect", () => {
  console.log("connected");
  notify({
    title: "Riskmatic",
    message: "Connected with Riskmatic",
  });
});

socket.on("initiated", async () => {
  console.log("initiated");
  const soundFile = path.join(__dirname, "./assets/ambulanceSiren.wav")

  sound.play(soundFile, 1); //file,volume

  notify({
    title: "Riskmatic SOS",
    message: "Please click here to check dashboard.",
    openUrl: `${CLIENT_URL}/sosDashboard`,
  });
});
