// This is the primary file for the api

// Dependencies
const http = require('http');
const url = require('url'); // Importing URL module for parsing URL strings
const handlers = require('./lib/handlers.js'); // Importing request handlers
const helpers = require('./lib/helpers.js'); // Importing helper functions
const fs=require("fs");

// Create HTTP server instance
let httpServer = http.createServer((req, res) => {
  Server(req, res); // Call the Server function for handling requests
});

// Start the HTTP server and have it listen on port 3000
httpServer.listen(3000, () => {
  console.log(`http server is listening on port 3000`);
});

// Server function to handle incoming requests
const Server = (req, res) => {

  if (req.url == "/") {
    fs.readFile("./public/homepage.html", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    })
  } else if (req.url == "/homepage.js") {
    fs.readFile("./public/homepage.js", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'document' })
        res.end()
      }
    })
  }

  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path from the parsed URL and trim it
  const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // Get the HTTP method of the request and convert it to lowercase
  const method = req.method.toLowerCase();

  // Buffer to store request body data
  let buffer = '';
  
  // Store body data in the buffer when received
  req.on('data', (data) => {
    buffer += data;
  });

  // Handle request when data transmission ends
  req.on('end', () => {
    // Choose the appropriate handler based on the requested path
    const chosenHandler = routing(trimmedPath);

    // Create data object containing request details
    let data = {
      queryStringObject: parsedUrl.query,
      method: method,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the specific handler according to the path
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code returned by the handler or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload returned by the handler or default to an empty object
      payload = typeof payload === 'object' ? payload : {};

      // Convert payload to a string
      const payloadString = JSON.stringify(payload);

      // Set response headers
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode); // Write status code to response header
      res.end(payloadString); // Send response with payload as JSON string
    });
  });
};

// Routing function to determine the appropriate request handler
function routing(path) {
  if (path === 'products') {
    return handlers.products; // Return the products handler
  } else {
    return handlers.notFound; // Return the notFound handler for unknown paths
  }
}
