import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../useravatar/UserListItem'; 
import UserBadgeItem from '../useravatar/UserBadgeItem';
// axios.defaults.baseURL = 'https://backend-chatapp-f9f8.onrender.com';
// axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.baseURL = "https://chat-app-kukz.onrender.com"
const GroupChatModal = ({children}) => {
    const {user,chats,setChats} = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName] = useState()
    const [selectedUsers,setSelectedUsers] = useState([]);
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const toast = useToast(); 
    const handleSearch = async (query)=>{

        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoading(true);
            const config={
                headers:{
                    Authorization :`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data);
            console.log(data)
            
        } catch (error) {
            toast({
                title:"Error Occured",
                description: "Failed to load the search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }
    const handleSubmit = async ()=>{
        if(!groupChatName||!selectedUsers){
            toast({
                title: "Please fill all the Fields ",
                // description: "Failed to load the search results",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.post("/api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
            },config);
            setChats([data,...chats]);
            onClose();
            toast({
                title: "New group chat created ",
                // description: "Failed to load the search results",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        } catch (error) {
            toast({
                title: "failed to create group chat ",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    }
    const handleDelete = async (delUser)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel  ._id!==delUser._id))
    };
    const handleGroup =async (userToAdd)=>{
        if(await selectedUsers.includes(userToAdd)){
            toast({
                title: "User Already Added",
                // description: "Failed to load the search results",
                status: "Warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg Ramu, Shamu, Ghanshu' mb={1} onChange={(e)=>handleSearch(e.target.value)} />
                        </FormControl>
                        {/* selected user */}
                        <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                        {selectedUsers.map(u=>(
                            <UserBadgeItem key={user._id}
                            user={u}
                            handleFunction={()=>handleDelete(u)}
                            />
                        ))}
                        </Box>
                        {/* render search user */}
                        {loading?<div>loading</div>:(
                            searchResult?.slice(0,4).map(user=>(
                                <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue'  onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
