const connection =require('./connection')

let lastMessage = async function (req, res) {
    try {
        let user_id = req.params.id

        // For database connection and data fetch ::--------------------

        // let chats = `SELECT c.channel_id, MAX(chat.creation_datetime) , chat.message, 
        //             (case when c.created_by = ? then c.partner_name else c.user_name END) as user_name,
        //             SUM(chat.is_read) as unread_messages
        //             FROM tb_channels c JOIN tb_chat chat ON c.channel_id = chat.channel_id 
        //             WHERE c.is_group = 0 AND (c.created_by = ? OR c.member_id = ?) GROUP BY chat.channel_id`

        // let chats_result = await connection.query(chats,[user_id,user_id,user_id]);
        // let group_chats = `SELECT  c.channel_id, MAX(chat.creation_datetime) , chat.message, 
        //             c.group_name ,
        //             SUM(chat.is_read) as unread_messages
        //             FROM tb_channels c LEFT JOIN tb_groups g ON c.group_id = g.group_id JOIN tb_chat chat ON chat.channel_id = c.channel_id
        //             WHERE c.group_id in (select distinct group_id from tb_groups where group_member = ? )  GROUP BY chat.channel_id`

        // let group_result = await connection.query(group_chats,[user_id]);
        // let obj = {
        //     'chats' : chats_result || [],
        //     'groups' : group_result || []
        // }


        // dummy data for now 
        chats = [{
                'message': 'bye',
                'user_name': 'deepak',
                'unread_message': 3
            },
            {
                'message': 'hi',
                'user_name': 'rahul',
                'unread_message': 4
            }
        ]

        groupChats = [{
                'message': 'bye',
                'group_name': 'test',
                'unread_message': 5
            },
            {
                'message': 'hi',
                'group_name': 'fun',
                'unread_message': 3
            }
        ]
        let obj = {
            'chats': chats,
            'groups': groupChats
        }
        res.status(200).json(obj)
    } catch (err) {
        console.log(">>>>>>", err)
    }
}


module.exports = { lastMessage }