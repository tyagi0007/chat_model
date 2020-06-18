const connection =require('./connection')

let lastMessage = async function (req, res) {
    try {
        let user_id = req.params.id

        // For database connection and data fetch ::--------------------

        let chats = `select t1.time,t1.user_name,t1.unread_messages,t2.message, 1 as chat_type from (SELECT c.channel_id, MAX(chat.creation_datetime) as time , 
        (case when c.created_by = ? then c.partner_name else c.user_name END) as user_name,
        sum(chat.is_read) as unread_messages
        FROM tb_channels c JOIN tb_chat chat ON c.channel_id = chat.channel_id 
        WHERE c.is_group = 0 
        AND (c.created_by = ? OR c.member_id = ?)
        GROUP BY user_name) as t1 JOIN ( select channel_id , creation_datetime as time, message from tb_chat) as t2 on t1.time = t2.time AND t1.channel_id = t2.channel_id`

        connection.query(chats, [user_id, user_id, user_id], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                let chat_data = result
                console.log(result)
                let group_chats = `select t1.group_name, t1.time, t1.unread_messages, t1.chat_type,t2.message from (select g.group_id , g.group_name, max(c.creation_datetime) as time, sum(c.is_read) as unread_messages , 2 as chat_type from tb_groups g join tb_chat c on c.channel_id = g.group_id where group_member = ? GROUP BY g.group_id ) as t1 JOIN ( select channel_id , creation_datetime as time, message from tb_chat) as t2 on t1.time = t2.time AND t1.group_id = t2.channel_id`

                connection.query(group_chats, [user_id], function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        let group_chats = result
                        for (let i = 0; i < group_chats.length; i++) {
                            chat_data.push(group_chats[i])
                        }
                        res.json({
                            status: "200",
                            message: "Fetch All chats",
                            data: chat_data
                        })

                    }
                })
            }
        });       


        // response of above 
        // let chat_data= [{"time":"2020-06-18T09:17:34.000Z","user_name":"rahul","unread_messages":4,"message":"good","chat_type":1},{"time":"2020-06-18T09:25:26.000Z","user_name":"shubham","unread_messages":2,"message":"this is not 2 this is 3 ","chat_type":1},{"group_name":"code","time":"2020-06-18T11:26:22.000Z","unread_messages":1,"chat_type":2,"message":"this is group"}]

        // res.json({
        //     status:"200",
        //     message:"Fetch All chats",
        //     data: chat_data
        //     })

    } catch (err) {
        console.log(">>>>>>", err)
        // res.status
    }
}


module.exports = { lastMessage }