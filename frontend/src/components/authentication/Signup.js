import { Button, VStack } from '@chakra-ui/react'
import { Input, InputGroup ,InputRightElement} from '@chakra-ui/input'
import React, { useState } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
// axios.defaults.baseURL = 'https://backend-chatapp-f9f8.onrender.com';
axios.defaults.baseURL = "http://localhost:5000"
const Signup = () => {
    // const instance = axios.create({
    //     baseURL: "https://chatappbackend2.onrender.com",
    // });
    const [show, setShow] = useState(false);
    const [name, setName] = useState(""); 
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [pic, setpic] = useState("");
    const [loading,setLoading] = useState(false)
    const handleClick = ()=>setShow(!show)
    const toast = useToast()
    const history = useHistory();
    const postDetails = async (pics)=>{ 
        setLoading(true);
        if(pics===undefined){
            toast({
                title: 'Please Select an Image',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom',
            })
            return;
        }
        if(pics.type==="image/jpeg"|| pics.type==='image/png'){
            const data = new FormData();
            data.append('file',pics);
            data.append("upload_preset","Chatters")
            data.append("cloud_name","dqdpzwcqp")
            fetch("https://api.cloudinary.com/v1_1/dqdpzwcqp/image/upload",{
                method:'post',
                body:data,
            }).then((res)=>res.json())
            .then(data=>{
                setpic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false)
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }else {
            toast({
                title: 'Please Select an Image',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })

        }
    };
    const submitHandler =async (e)=>{
        e.preventDefault();
        setLoading(true);
        if(!name||!email||!password||!confirmpassword){
            toast({
                title: 'Please Fill all the Fields',
                description: "You have to fill the required fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        if(password!==confirmpassword){
            toast({
                title: 'Passwords do not match',
                description: "You have to fill same password in confirm password input",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers:{
                    "Content-type":"application/json",
                },
            };

            const { data } = await axios.post('/api/user',{name,email,password,pic},config);
            // console.log(name,email,password,pic)
            // const response = await fetch(`http://localhost:5000/api/user`, {
            //     method: "POST", // *GET, POST, PUT, DELETE, etc.
            //     mode: "no-cors", // no-cors, *cors, same-origin
            //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            //     credentials: "same-origin", // include, *same-origin, omit
            //     headers: {
            //         "Content-Type": "application/json",
            //         },
            //     body: JSON.stringify({name, email, password,pic}),// body data type must match "Content-Type" header
            // });
            // const json = await response.json()
            // console.log(json);
            // console.log(data);
            toast({
                title: 'Registeration Successfull',
                description: "We have successfully registered your account",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            // console.log(data);
            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: "error hai",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false)
        }
    };
    return (
        <VStack spacing={"5px"} >
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    onChange={(e) => setemail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?'text':'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    <InputRightElement
                        width={"4.5rem"}
                    >
                        <Button h={"1.75rem"} size={'sm'} onClick={handleClick} >
                            {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='cpassword' isRequired>
                <FormLabel>Confirm-Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?'text':'password'}
                        placeholder='Confirm your Password'
                        onChange={(e) => setconfirmpassword(e.target.value)}
                    />
                    <InputRightElement
                        width={"4.5rem"}
                    >
                        <Button h={"1.75rem"} size={'sm'} onClick={handleClick}>
                            {show ? "Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' >
                <FormLabel>Upload Your Pic</FormLabel>
                
                    <Input
                        type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
            </FormControl>
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading = {loading}
            >
                Sign-Up
            </Button>
            </VStack>
    )
}

export default Signup
