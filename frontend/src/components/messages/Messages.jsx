import React from 'react'
import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { useRef,useEffect } from 'react';
import useListenMessages from '../../hooks/useListenMessages';

function Messages() {
  const { messages, loading } = useGetMessages();
  useListenMessages()
  const lastMessagesRef = useRef();

  useEffect(()=>{
    setTimeout(()=>{
      lastMessagesRef.current?.scrollIntoView({behavior : "smooth"})
    },100)
  },[messages])

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!loading && messages.length > 0 && messages.map((message) => (
        <div key={message._id} ref={lastMessagesRef}>
          <Message message={message}></Message>
        </div>
      ))}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className='text-center'>Send a message to begin the conversation</p>
      )}
    </div>
  )
}

export default Messages;

