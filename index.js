const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const chat = require('./chat.js')
const fun = require('./controller')

// for mysql connection 
const Connection =require('./connection')



let sql=''

let userData = {
  '1': 'sahil',
  '2': 'rahul',
  '3': 'shubham'
}

let groupData = {
  '5':'demo',
  '6':'code'
}

app.get('/', function(req, res){
  res.send('Welcome Abroad')
});

app.get('/:fid/:tid', chat.newChat)
app.get('/group/:fid/:grpId', chat.newGrpChat)
app.get('/:id', fun.lastMessage)

io.on('connection', function (socket) {
  // one to one chat
  socket.on('chatId', function (msg, fid, tid) {
    console.log('>>>>>>>>>', fid, tid)
    // store chats in db 
    saveChat(fid, userData[fid], tid, userData[tid],msg)

    io.emit(`chatId_${fid}${tid}`, msg);
    io.emit(`chatId_${tid}${fid}`, msg);
  });
// group chat 
  socket.on('grpId', function (msg, fid, grpid) {
    console.log('>>>>>>>>>', fid, grpid)

    // store groupchats in db 
    saveGroupchat(fid, userData[fid], grpid, groupData[grpid], msg)
    socket.join(grpid)
    io.emit(`chatId_${grpid}`, msg)
  });

});

http.listen(port, function () {
  console.log('listening on *:' + port);
});


function saveChat(userID, userName, partnerId, partnerName, message) {
  let channelId = 0;
  let sql = ''
  sql = 'select channel_id from tb_channels  where (created_by = ? AND member_id = ?) OR (created_by = ? AND member_id = ?) '
  Connection.query(sql, [partnerId, userID, userID, partnerId], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length) {
        sql = 'INSERT INTO `tb_chat`(`channel_id`, `message_by`, `message`) VALUES (?,?,?)'
        Connection.query(sql, [result[0].channel_id, userID, message], function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("data added ")
          }
        })
      } else {
        sql = 'INSERT INTO `tb_channels`(`created_by`, `user_name`, `member_id`, `partner_name`, `group_name`) VALUES (?,?,?,?,?)'
        Connection.query(sql, [userID, userName, partnerId, partnerName, ''], function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("data added ")
            channelId = result.insertId

            sql = 'INSERT INTO `tb_chat`(`channel_id`, `message_by`, `message`) VALUES (?,?,?)'
            Connection.query(sql, [channelId, userID, message], function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("data added ")
              }
            })
          }
        })
      }
    }
  })
}

function saveGroupchat(userID, userName, groupId, groupName, message) {
  let channelId = 0;
  let sql = ''

  sql = 'SELECT `group_id` FROM `tb_groups` WHERE `group_member` = ? AND `group_id` = ? '
  Connection.query(sql, [userID, groupId], function (err, result) {
    if (err) {
      console.log(err);
    } else {

      if (result.length) {

        sql = 'INSERT INTO `tb_chat`(`channel_id`, `message_by`, `message`) VALUES (?,?,?)'
        Connection.query(sql, [result[0].group_id, userID, message], function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("data added ")
          }
        })
      } else {
        sql = 'INSERT INTO `tb_groups`(`group_id`, `group_name`, `group_member`) VALUES (?,?,?) '
        Connection.query(sql, [groupId, groupName, userID], function (err, result) {
          if (err) {
            console.log(err);
          } else {

            sql = 'INSERT INTO `tb_chat`(`channel_id`, `message_by`, `message`) VALUES (?,?,?)'
            Connection.query(sql, [groupId, userID, message], function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("data added ")
              }
            })
          }
        })
      }
    }
  })

}