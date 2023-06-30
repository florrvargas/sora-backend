const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rutas = require("./rutas/index.js");
const http = require('http');
const socketIO = require('socket.io');
require("./db.js");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Manejo del evento "viajeSolicitado"
  socket.on('viajeSolicitado', (data) => {
    // Emitir el evento "viajeSolicitado" a todas las conductoras conectadas
    socket.broadcast.emit('viajeSolicitado', data);
  });

  // Otros eventos de notificación que necesites
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/", rutas);

// Error catching endware.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
