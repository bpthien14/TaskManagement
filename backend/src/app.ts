import express from "express";
import cors from "cors";
import { config } from "./config/config";
import { Database } from "./utils/database";
import routes from "./routes/index.route";

const app = express();
const PORT = config.server.port;
const database = new Database();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("API quản lý công việc đang hoạt động!");
});


app.use("/api", routes);

async function startServer() {
    try {
        await database.connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Không thể khởi động server:", error);
        process.exit(1);
    }
}

startServer();
