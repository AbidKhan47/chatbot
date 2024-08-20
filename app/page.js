'use client'
import { Box, Stack, TextField, Button, Typography} from "@mui/material";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState ([
    {
    role: 'assistant',
    content: `Hi, I'm ModACar`,
   },
  ])

  const [message, setMessage] = useState('')
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    // Add the user's message to the state
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);
  
    try {
      // Send the message to the API
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json' // Corrected header
        },
        body: JSON.stringify({
          message: message
        })
      });
  
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Add the assistant's response to the state
      setMessages((messages) => [
        ...messages,
        { role: data.role, content: data.content },
      ]);
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  
    // Clear the input field
    setMessage('');
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box 
      width = '100vw' 
      height ='vh' 
      display='flex' 
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
  >
    <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Typography variant="h6" component="h2">
          ModACar
        </Typography>
    </Box>
    <Stack 
    direction = "column"
    width = "600px"
    height = "700px"
    border = "1px solid black"
    borderRadius = {2}
    p={2}
    spacing = {3}
    >
      <Stack direction='column' 
      spacing = {2} 
      flexGrow = {1} 
      overflow = 'auto'
       maxHeight = '100%'
       >{
        messages.map((message ,index) =>(
          <Box key = {index} display = 'flex' justifyContent={
            message.role === 'assistant' ? 'flex-start' : 'flex-end'
          }> <Box bgcolor = {
            message.role ==='assistant' ? 'primary.main' : 'secondary.main'
          }
          color = 'white'
          borderRadius = {8}
          p={3}
          >
             {message.content}
          </Box>
          </Box>
        ))
       }
        <div ref={messageEndRef} />
       </Stack>
       <Stack direction = 'row' spacing = {2}>
        <TextField
        label = 'message'
        fullWidth
        value = {message}
        onChange={(e) => setMessage(e.target.value)} 
        onKeyDown={handleKeyDown}
        />
        <Button variant = 'contained' onClick={sendMessage}>
          Send
          </Button>
       </Stack>
    </Stack>
  </Box>
  )
}
