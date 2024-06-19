const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const fs = require("fs");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(__dirname, "token.json");

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
}

function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  console.log("Token stored to", TOKEN_PATH);
}

function setCredentials() {
  try {
    const token = fs.readFileSync(TOKEN_PATH, "utf8");
    oAuth2Client.setCredentials(JSON.parse(token));
  } catch (error) {
    getAccessToken();
  }
}

module.exports = {
  oAuth2Client,
  setCredentials,
  saveToken,
  getAccessToken,
};
