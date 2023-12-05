// testServer.js
const app = require("../code/backend/server.js");
const PORT = 8001;

function startTestServer() {
  const server = app.listen(PORT, () => {
    console.log(`Test Server running on http://localhost:${PORT}`);
  });

  return server;
}

module.exports = startTestServer;
