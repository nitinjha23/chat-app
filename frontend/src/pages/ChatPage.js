import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import {Box} from "@chakra-ui/layout"
import SideDrawer from "../components/miscellanous/SideDrawer";
import Mychats from "../components/Mychats";
import ChatBox from "../components/ChatBox";
// axios.defaults.baseURL = 'https://backend-chatapp-f9f8.onrender.com';
// axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.baseURL = "https://chat-app-kukz.onrender.com"
const ChatPage = () => {
  const {user}= ChatState();
  const [fetchAgain,setFetchAgain] = useState(false);

  return (
    <div style={{width:'100%'}}>
      {user &&<SideDrawer/>}
      <Box
      display="flex"
      justifyContent="space-between"
      w='100%'
      h='91.5vh'
      p='10px'
      >
       {user && <Mychats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
