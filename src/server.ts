import { thresholdWorker } from "./workers/threshold.js";
import http from 'http'
import app from "./app.js";
import { initSocet } from "./socket/socket.js";
import 'dotenv/config'

const PORT = process.env.PORT || 3000;
const server = http.createServer(app)

initSocet(server);

console.log("Worker is ready:", !!thresholdWorker);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})