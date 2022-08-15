const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.all(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = 7777

// let clients = [];
// let facts = [123123];

app.listen(PORT, () => {
  // console.log(`Facts Events service listening at http://localhost:${PORT}`)
  console.log(`Events service listening at http://localhost:${PORT}`)
})


function eventsHandler(request, response, next) {
  const userNo = request.query.user_no
  console.log(userNo)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://rabbitmq:rabbitmq@211.195.9.228', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = `task${userNo}`;

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(`Received ${msg.content.toString()} of ${userNo}`, );
            const nowDate = Date.now();
            let data = `data: ${msg.content.toString()}, ${nowDate}\n\n`;
            response.write(data);
        }, {
            noAck: true
        });
    });
});

  // const newClient = {
  //   id: clientId,
  //   response
  // };

  // clients.push(newClient);
  // newClient.response.write(`data: qwqwf`)

  request.on('close', () => {
    console.log(`Connection closed`);
    // console.log(`${clientId} Connection closed`);
    // clients = clients.filter(client => client.id !== clientId);
  });
}

app.get('/events', eventsHandler);