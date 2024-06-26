import React, { useState } from 'react'
import {Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast} from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios'
import UserListItem from '../useravatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
// axios.defaults.baseURL = 'https://chatappbackend2.onrender.com';
// axios.defaults.baseURL = 'https://backend-chatapp-f9f8.onrender.com';
// axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.baseURL = "https://chat-app-kukz.onrender.com"
const SideDrawer = () => {
  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [loading,setLoading] = useState(false)
  const [loadingChat,setLoadingChat] = useState()

  const toast = useToast();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSearch = async ()=>{
    if(!search){
      toast({
        title:"Please Enter something in search",
        status:"warning",
        duration:5000,
        isClosable: true,
        position : "top-left"
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`,config)  
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
      setLoading(false);
      return;
    }
  };

  const accessChat = async(UserId)=>{
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },

      };  
      console.log({UserId})
      const {data} = await axios.post('/api/chat',{UserId},config); 
      console.log(data);
      if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false); 
      onClose();

    } catch (error) {
      toast({
        title: "Error Fetching the chat ",
        description: error.message,
        isClosable: true,
        status: "error",
        duration: 5000,
        position: "bottom-left"
      });
      setLoading(false);
      return;
    }
  }

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push('/');
  }
  return (
    <>
     <Box
      display="flex"
      justifyContent={"space-between"}
      alignItems={'center'}
      bg="white"
      w="100%"
      p={"5px 10px 5px 10px"}
      borderWidth={"5px"}
     >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{base:"none",md:"flex"}} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={'2xl'} fontFamily={"Work sans"}>Chatters</Text>
        <div>
          <Menu>
            <MenuButton p={1} >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={'2xl'} m={1}/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length&&"No new messages"}
              {notification.map(notif=>(
                <MenuItem key={notif._id} onClick={()=>{
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n)=>n!==notif));
                }}>
                  {notif.chat.isGoroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
             <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
     </Box>
     <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth={'1px'}>Search User</DrawerHeader>
        <DrawerBody>
          <Box display={'flex'} pb={2}>
            <Input
              placeholder='Search User '
              mr={2}
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <Button 
            onClick={handleSearch}
            >Go</Button>
          </Box>
          {loading?(
            <ChatLoading/>
          ):(
            searchResult?.map(user=>(
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
              />
            ))
          )}
          {loadingChat&& <Spinner ml={"auto"} display={"flex"}/>}
        </DrawerBody>
      </DrawerContent>
     </Drawer>
    </>
  )
}

export default SideDrawer
