import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const sendMessage = async(req,res)=>{
    try{
        const {id:receiverId} = req.params;
        const {message} = req.body;
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants:{
                $all: [senderId, receiverId] //find the conversation where participants array includes all these fields
            },
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }
        console.log("new conversation created");

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        }) 
        // console.log("message created");

        if(newMessage){
            conversation.message.push(newMessage._id)
        }

        //SOCKET IO FUNCTIONALITY WILL GO HERE


        // await conversation.save();
        // await newMessage.save();

        //this will run in parallel
        await Promise.all(conversation.save(),newMessage.save());

        res.status(201).json(newMessage)

    }
    catch(error){
        console.log("error in send message controller", error);
        res.status(500).json({error:"Internal server error"})
    }

}

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