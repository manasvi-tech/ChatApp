import {io} from '../socket/socket.js'
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId } from '../socket/socket.js';


export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId] // Find the conversation where participants array includes all these fields
            },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
            console.log("New conversation created");
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            conversation.message.push(newMessage._id); // Assuming 'messages' is the correct field in your schema
        }

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            // io.to(socket._id).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        // Save both the conversation and the new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMessages = async(req,res)=>{
    try{
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]}
        }).populate("message") //not reference but actual message

        if(!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.message);

    } catch(error){
        console.log("error in send message controller", error);
        res.status(500).json({error:"Internal server error"})
    }
}