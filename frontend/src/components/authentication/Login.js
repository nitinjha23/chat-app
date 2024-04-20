import React from 'react'
import { Button, Toast, VStack } from '@chakra-ui/react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { useState } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
// axios.defaults.baseURL = 'https://backend-chatapp-f9f8.onrender.com';
// axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.baseURL = "https://chat-app-kukz.onrender.com"
const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const handleClick = () => setShow(!show)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()
    const submitHandler = async () => { 
        setLoading(true);
        if(!email||!password){
            Toast({
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
        try {
            const config = {
                headers:{
                    "Content-Type":"application/json"
                },
            };
            const {data} = await axios.post(
                "/api/user/login",
                {email,password},
                config
            );
            toast({
                title: 'Login Successfull',
                description: "You have Successfully logged IN",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
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
            <FormControl id='email' isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setpassword(e.target.value)}
                        value={password}
                    />
                    <InputRightElement
                        width={"4.5rem"}
                    >
                        <Button h={"1.75rem"} size={'sm'} onClick={handleClick} >
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading = {loading}
            >
                Login
            </Button>
            <Button 
                variant={'solid'}
                colorScheme='red'
                width={"100%"}
                isLoading={loading}
                onClick={()=>{
                    setemail("guest@example.com")
                    setpassword('123456')
                }}
            >
                Get Guest user Credentials
            </Button>
        </VStack>
    )

}

export default Login
