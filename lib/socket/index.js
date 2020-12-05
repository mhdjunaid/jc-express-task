const path = '/socket';
const io = require('socket.io')({ path });

io.use(async (socket, next) => {
    console.log('socket is connected');
  return next();
});


io.on('connection', (socket) => {
  try {
    console.log('connecting to socket');
  }
  catch (e) {
    socket.disconnect();
  }
  socket.on('disconnect', () => {
  });
  socket.on('error', (error) => {

  });
});

exports.io = io;
exports.path = path; // for io clients
