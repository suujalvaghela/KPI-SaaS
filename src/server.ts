import http from 'http'
import app from "./app.js";
import { initSocet } from "./socket/socket.js";
import 'dotenv/config'

const PORT = process.env.PORT;
const server = http.createServer(app)

initSocet(server);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})