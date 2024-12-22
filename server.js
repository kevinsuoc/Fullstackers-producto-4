/* 
  Requirements
*/
// Config
const config = require("./config/config");

// mongoDB
require("./config/database");

// Server basics
const express = require("express");
const { createServer } = require("http");

// Apollo Server
const { ApolloServer } = require("apollo-server-express");
// const {
//   ApolloServerPluginLandingPageLocalDefault,
// } = require("apollo-server-core");

// GraphQL Squema
const { typeDefs, resolvers } = require("./schema");

// Socket IO Util
const { initSocket } = require('./socket');

/*
  Multer
*/

// Handle files
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "/assets/");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

/*
  Run
*/

async function startServer(typeDefs, resolvers) {
  // Start express app
  const app = express();

  // Define apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    subscriptions: {
      onConnect: (connectionParams, webSocket, context) => {
        // console.log('Apollo subscriptor conectado!')
      },
      onDisconnect: (webSocket, context) => {
        // console.log('Apollo subscriptor desconectado!')
      },
    }
  //  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });


  // Start apollo
  await server.start();

  // Add express middleware to Apollo server
  server.applyMiddleware({ app });

  // Create HTTP server
  const httpServer = createServer(app);

  // Socket.io
  initSocket(httpServer)

  // Handle pubsub with apollo
  server.installSubscriptionHandlers(httpServer)

  // Serve static
  app.use(express.static("public"));

  // Download file endpoint
  app.get('/download', (req, res) => {
    const { url, name } = req.query;

    if (!url || !name) {
        return res.status(400).send({ message: 'Faltan parámetros url o filename' });
    }

    const filePath = path.normalize(path.join(__dirname, '/assets', url));

    if (!filePath.startsWith(path.join(__dirname, '/assets'))) {
        return res.status(403).send({ message: 'Acceso denegado' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'Archivo no encontrado' });
    }

    res.download(filePath, name, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).send({ message: 'Error al descargar el archivo' });
        }
    });
  });
  
  // Assests endpoint
  app.post("/assets", upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no encontrado." });
    }
    res.status(200).json({
      message: "Archivo subido correctamente.",
      filename: req.file.originalname,
      url: `${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  // Fallback
  app.get('/', (req, res) => {
    res.redirect("/Html/index.html");
  });

  // Listen
  await new Promise(resolve => httpServer.listen(config.port, resolve));
  console.log(`Server http: http://localhost:${config.port}${server.graphqlPath}`);
  console.log(`Server ws: ws://localhost:${config.port}${server.subscriptionsPath}`);
  return { server, app, httpServer };
}

startServer(typeDefs, resolvers);

