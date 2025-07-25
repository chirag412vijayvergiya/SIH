/*
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // Limit requests from same API
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const passport = require('passport');
const cors = require('cors');
// const path = require('path');
const AppError = require('./utils/AppError');
// const session = require('express-session');
require('./utils/passport');
// const cookieSession = require('cookie-session');
// const session = require('express-session');

//const userRoute = require('./Routes/userRoute');
const doctorRouter = require('./Routes/doctorRoute');
const patientRouter = require('./Routes/patientRoute');
const appointmentRouter = require('./Routes/appointmentRoute');
const reviewRouter = require('./Routes/reviewRoute');
const GlobalErrorHandler = require('./Controllers/errorController');
const appointmentController = require('./Controllers/appointmentContoller');

const app = express();

app.set('trust proxy', 1);
app.use(cookieParser());
// Use express-session middleware

// app.use('/users', express.static(path.join(__dirname, 'public/users')));

app.use(
  cors({
    origin: ['https://jeevan-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
    headers: [
      'Content-Type',
      'Authorization',
      'X-Frame-Options',
      'access-control-allow-origin',
    ],
  }),
);

// ******************************************************************************* //

// GLOBAL MIDDLEWARES
// Set security HTTP headers :-  A powerful allow-list of what can happen on your page which mitigates many attacks
app.use(helmet());

// ******************************************************************************* //

// Morgen is logging MIDDLEWARE that log the HTTP request
if (process.env.NODE_ENV === 'development') {
  //(dev) is a predefined log format
  app.use(morgan('dev'));
}

// ******************************************************************************* //

// GLOBAL MIDDLEWARES
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60 minutes
  message: 'Too many requests from this IP, please try again in an hour!',
});

// '/api' will affect the all routes which start from api url
app.use('/api', limiter);

// ******************************************************************************* //

// Body parsers
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  appointmentController.webhookCheckout,
);

//It should be used before route defined
//the parsed JSON data is converted into a JavaScript object
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Passport initialization
app.use(passport.initialize());
// ******************************************************************************* //

// Data sanitization against NoSQL query injection like $ or . malicious characters
app.use(mongoSanitize());

// ******************************************************************************* //

// Data sanitization of user input against XSS
//This function removes or escapes malicious code
app.use(xss());

// ******************************************************************************* //

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
// );

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/reviews', reviewRouter);

//For other route which we have not defned!
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;

*/

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); // Limit requests from same API
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// const path = require('path');
const AppError = require('./utils/AppError');
// const session = require('express-session');
require('./utils/passport');
// const cookieSession = require('cookie-session');
// const session = require('express-session');

//const userRoute = require('./Routes/userRoute');
const doctorRouter = require('./Routes/doctorRoute');
const patientRouter = require('./Routes/patientRoute');
const messageRouter = require('./Routes/messageRoute');
const chatRouter = require('./Routes/chatRoute');
const hospitalRouter = require('./Routes/hospitalRoute');
const InventoryRouter = require('./Routes/InventoryRoute');

const appointmentRouter = require('./Routes/appointmentRoute');
const reviewRouter = require('./Routes/reviewRoute');
const GlobalErrorHandler = require('./Controllers/errorController');
const appointmentController = require('./Controllers/appointmentContoller');

// const Message = require('./models/messageModel');
// const { default: mongoose } = require('mongoose');

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ['https://jeevan-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
  },
});

app.set('trust proxy', 1);
app.use(cookieParser());
// Use express-session middleware

// app.use('/users', express.static(path.join(__dirname, 'public/users')));

app.use(
  cors({
    origin: ['https://jeevan-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
    headers: [
      'Content-Type',
      'Authorization',
      'X-Frame-Options',
      'access-control-allow-origin',
    ],
  }),
);

// ******************************************************************************* //

// GLOBAL MIDDLEWARES
// Set security HTTP headers :-  A powerful allow-list of what can happen on your page which mitigates many attacks
app.use(helmet());

// ******************************************************************************* //

// Morgen is logging MIDDLEWARE that log the HTTP request
if (process.env.NODE_ENV === 'development') {
  //(dev) is a predefined log format
  app.use(morgan('dev'));
}

// ******************************************************************************* //

// GLOBAL MIDDLEWARES
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 60 minutes
  message: 'Too many requests from this IP, please try again in an hour!',
});

// '/api' will affect the all routes which start from api url
app.use('/api', limiter);

// ******************************************************************************* //

// Body parsers
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  appointmentController.webhookCheckout,
);

//It should be used before route defined
//the parsed JSON data is converted into a JavaScript object
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Passport initialization
app.use(passport.initialize());
// ******************************************************************************* //

// Data sanitization against NoSQL query injection like $ or . malicious characters
app.use(mongoSanitize());

// ******************************************************************************* //

// Data sanitization of user input against XSS
//This function removes or escapes malicious code
app.use(xss());

// ******************************************************************************* //

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
// );

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the backend API!',
  });
});

app.use('/api/v1/hospitals', hospitalRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/hospitals', hospitalRouter);
app.use('/api/v1/inventory', InventoryRouter);

//For other route which we have not defned!
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Socket.IO event listeners
io.on('connection', (socket) => {
  console.log('socket.io connected successfully', socket.id);

  socket.on('setup', (userData) => {
    console.log('User setup with ID:', userData._id);
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined chat room:', room);
  });

  socket.on('typing', (room) => socket.to(room).emit('typing'));
  socket.on('stop typing', (room) => socket.to(room).emit('stop typing'));

  // Ensure the correct path

  socket.on('new message', (newMessageReceived) => {
    console.log('New message recieved :- ', newMessageReceived);
    // const { chat } = newMessageReceived;

    // // Ensure chat.users is defined and non-empty
    // if (!chat.users || chat.users.length === 0) {
    //   console.log('chat.users is not defined or empty');
    //   return;
    // }

    // // Iterate through each user in the chat
    // chat.users.forEach((user) => {
    //   // Skip sending to the sender of the message
    //   if (
    //     user.user.equals(newMessageReceived.sender) &&
    //     user.userModel === newMessageReceived.senderModel
    //   ) {
    //     return;
    //   }
    console.log(
      'New message recieved :- ',
      newMessageReceived.chat._id.toString(),
    );

    // Emit 'message received' event to each user in the chat (except the sender)
    socket
      .in(newMessageReceived.chat._id.toString())
      .emit('message received', newMessageReceived);
    // });
  });
});

app.use(GlobalErrorHandler);

module.exports = { app, server };
