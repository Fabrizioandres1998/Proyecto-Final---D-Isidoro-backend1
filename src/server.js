import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";

import indexRoutes from "./routes/index.js";
import __dirname from "./dirname.js";
import viewsRoutes from "./routes/views.routes.js";

const app = express();
const dbName = "proyectoFinal";
mongoose.connect(`mongodb+srv://fabrizioandres98:chinistriquis98@primer-cluster.ecbqufd.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Primer-Cluster`
).then(() => {
    console.log("DB Connected");
}) .catch((error) => {
    console.log(error);
})


// PORT
const PORT = 8080;

// App configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuración handlebars
app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Configurar middleware para pasar `io`
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});

const io = new Server(httpServer);
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/", viewsRoutes);
app.use("/api", indexRoutes);

// Configuración Socket.io
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado", socket.id);
});
