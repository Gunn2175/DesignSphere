const express=require('express')
const cors=require('cors')
const http = require('http');
const morgan=require('morgan')
const dotenv= require('dotenv');
const cookieParser = require("cookie-parser");





const { Server } = require('socket.io');
const connectDb = require('./config/connectDb')
const path = require('path');
// Import routes and socket handler
const teamRoutes = require('./routes/projectRoutes');
const canvasSocket = require('./sockets/canvasSocket');
const sidebarItemsRoutes = require('./routes/sidebarRoutes');
const savedesignRoutes = require('./routes/savedesignRoutes');
const templatesRoutes = require('./routes/templatesRoutes');
//const projectRoutes = require('./routes/projectRoutes');
const sendRoutes = require('./routes/sendRoutes');
const designimageRoutes=require('./routes/designImageRoutes')
const shareRoutes=require('./routes/shareRoutes')


//config dot env file

dotenv.config();;
//database call
connectDb();
const allowedOrigins = [
  'http://localhost:3000',
  'https://designsphere27.netlify.app'
];

//rest object
const app=express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {

    origin: ["http://localhost:3000",
      'https://designsphere27.netlify.app',
      ], // Allow only your client origin
    //methods: ["GET", "POST","PUT"],

    credentials: true
  }
  });
  
  //middlewares
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

//for testing only
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

//routes

//for user 
app.use('/api/v1/users',require('./routes/userRoute'))


// Serve static files from the 'uploads' directory
app.use('/api/v1/uploads/images', express.static(path.join(__dirname, 'uploads/images')));


app.use('/api/v1/uploads/animations',  express.static(path.join(__dirname, 'uploads/animations')));


app.use('/api/v1/uploads/designimage',express.static(path.join(__dirname, 'uploads/designimage')));

//design page
//sidebaritems and fileupload (images)
app.use('/api/v1/designpage', sidebarItemsRoutes);
//get templates
app.use('/api/v1/templates', templatesRoutes);

//save design
app.use('/api/v1/designs',savedesignRoutes);
//for teams
app.use('/api/v1/teams', teamRoutes);


// Socket.io for real-time collaboration
canvasSocket(io);

//print design 
app.use('/api/v1/shop',sendRoutes);
//upload design image in server
app.use('/api/v1/store',designimageRoutes);
//share
app.use('/api/v1/share',shareRoutes);


//port
const PORT=process.env.PORT||8080;

//listen server
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
