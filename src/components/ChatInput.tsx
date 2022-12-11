import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

export default function ChatInput(props:any) {
   const [message, setMessage] = useState('');
   const [sendEnabled, enableSend] = useState(false);
   const chatInput = useRef<TextInput>(null);

   useEffect(() => {
      enableSend(message.trim() ? true : false);
   }, [message])

   const messageChanged = (msg:string) => {
      setMessage(msg);
   }
   const sendMessage = () => {
      if(message.trim()) {
         props.sendMessage(message);
         chatInput.current?.clear();
         setMessage('');
      }
   }

   return (
      <Container>
         <MessageInput ref={chatInput} 
            onChangeText={(txt:string) => messageChanged(txt)}
            placeholder="Type your message..." multiline={true}
         />
         <SendIconContainer disabled={sendEnabled ? false:true} 
            onPress={sendMessage}
         >
            <MaterialIcons name="send" size={24} color={sendEnabled ? "#FFFFFF":"#458e8385"} />
         </SendIconContainer>
      </Container>
   )
}
      
const Container = styled.View`
   overflow: hidden;
   padding: 10px 10px;
   flex-direction: row;
   align-items: flex-end;
`
const MessageInput = styled.TextInput.attrs({ placeholderTextColor: '#D9D9D9' })`
   flex: 1;
   background-color: #5F5F5F;
   color: #FFFFFF;
   overflow: hidden;
   padding: 8px 20px;
   border-radius: 26px;
   font-size: 18px;
   font-weight: 400;
   line-height: 20px;
   margin-right: 5px;
`   
const SendIconContainer = styled.TouchableOpacity.attrs((props: {disabled:boolean}) => props)`
   padding: 10px;
   border: 1px solid ${(props) => props.disabled ? '#458e8385':'#458e83'};
   border-radius: 50px;
   background-color: ${(props) => props.disabled ? 'transparent':'#458e83'};
`