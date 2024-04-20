import React, { useEffect } from 'react'
import {Container,Box,Text, Tab, TabList, TabPanels, TabPanel, Tabs} from "@chakra-ui/react"

import CustomTab1 from './CustomTab'
import { useHistory } from 'react-router-dom'
const Home = () => {

  const history = useHistory();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user)history.push("/chats");
  },[history]);
  return (<Container maxW="xl" justifyContent={'center'}>
    <Box
    d='flex'
    justifyContent={"center"}
    p={3}
    bg={'white'}
    w="100%"
    m="40px 0 15px 0"
    borderRadius="lg"
    borderWidth="1px"
    >
      <Text fontSize={'4xl'}
      fontFamily={"Ubuntu"} >Chatters</Text>
    </Box>
    <Box bg={"white"} w={"100%"} p={4} borderRadius="lg" borderWidth={"1px"}>
      
      <CustomTab1/>
    </Box>
  </Container>
  )
}

export default Home
