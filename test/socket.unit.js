const http = require('http');
const ioClient = require('socket.io-client');
const { io, path } = require('../lib/socket');

const httpServer = http.createServer();
io.attach(httpServer);
httpServer.listen();
const httpServerAddr = httpServer.address();

let socket;
async function createSocket(opts = {}) {
  socket = ioClient.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    ...opts,
    path,
    transports: ['websocket']
  });

  return new Promise(((resolve, reject) => {
    socket.on('connect', () => {
      resolve(socket);
    });
    socket.on('connect_error', reject);
  }));
}

function cleanup(done) {
  socket.disconnect();
  socket = null;
  done();
}

test('basic communication', async (done) => {
  const s = await createSocket({});
  const randomValue = Math.random().toString();
  s.on('test', (m) => {
    expect(m).toBe(randomValue);
    done();
  });
  io.emit('test', randomValue);
  cleanup(done);
});

afterAll(async () => {
  await httpServer.close();
});
