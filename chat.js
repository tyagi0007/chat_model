
let newChat = (req, res) => {
  let fromId = req.params.fid
  let toId = req.params.tid
  let html = `<!doctype html>
    <html>
      <head>
        <title>Socket.IO chat</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font: 13px Helvetica, Arial; }
          form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
          form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
          form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages li { padding: 5px 10px; }
          #messages li:nth-child(odd) { background: #eee; }
          #messages { margin-bottom: 40px }
        </style>
      </head>
      <body>
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autocomplete="off" /><button>Send</button>
        </form>
        <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
        <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
        <script>
          $(function () {
            var socket = io();
            $('form').submit(function(){
              socket.emit('chatId', $('#m').val(),'${fromId}','${toId}');
              $('#m').val('');
              return false;
            });
            socket.on('chatId_${fromId}${toId}', function(msg){
              $('#messages').append($('<li>').text(msg));
              window.scrollTo(0, document.body.scrollHeight);
            });
          });
        </script>
      </body>
    </html>`;
    res.send(html)
}

let newGrpChat = (req, res) => {
  let fromId = req.params.fid
  let grpId = req.params.grpId
  let html = `<!doctype html>
    <html>
      <head>
        <title>Socket.IO chat</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font: 13px Helvetica, Arial; }
          form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
          form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
          form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
          #messages { list-style-type: none; margin: 0; padding: 0; }
          #messages li { padding: 5px 10px; }
          #messages li:nth-child(odd) { background: #eee; }
          #messages { margin-bottom: 40px }
        </style>
      </head>
      <body>
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autocomplete="off" /><button>Send</button>
        </form>
        <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
        <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
        <script>
          $(function () {
            var socket = io();
            $('form').submit(function(){
              socket.emit('grpId', $('#m').val(),'${fromId}','${grpId}');
              $('#m').val('');
              return false;
            });
            socket.on('chatId_${grpId}', function(msg){
              $('#messages').append($('<li>').text(msg));
              window.scrollTo(0, document.body.scrollHeight);
            });
          });
        </script>
      </body>
    </html>`;
    res.send(html)
}

module.exports = { newChat, newGrpChat }