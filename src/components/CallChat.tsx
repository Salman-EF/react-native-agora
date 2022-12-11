import React, { useEffect, useRef, useState } from "react"
import { MaterialIcons } from '@expo/vector-icons';
import styled from "styled-components/native"
import ChatInput from "./ChatInput";
import { ScrollView } from "react-native";

export default function CallChat(props:any) {
   const [chat, updateChat] = useState(new Array());
   const ChatContainerRef = useRef<ScrollView>();

   useEffect(() => {
      // ChatContainerRef.current?.scrollToEnd();
   })
   
   const sendMessage = (msg:string) => {
      const now = new Date().toLocaleDateString() +' at '+ new Date().toLocaleTimeString()
      const chatCard = { sender: 'You', msg: msg , time: now };
      const chatCard1 = { sender: 'Remote', msg: msg , time: now };
      updateChat([...chat, chatCard, chatCard1]);
      ChatContainerRef.current?.scrollToEnd();
   }
   
   return (
      <Modal>
         <Container>
            <ModalHeader>
               <ModalHeaderText>
                  <ModalTitle>{props.groupcall.title}</ModalTitle>
                  <ModalSubTitle>Started 2:00 AM, Dec 09 2021</ModalSubTitle>
               </ModalHeaderText>
               <MaterialIcons name="keyboard-arrow-down" size={32} color="#FFFFFF" onPress={props.toggleChatModal} />
            </ModalHeader>
            <ChatContainer ref={ChatContainerRef}>
               {chat.map((chatObj:chatObject, i) => {
                  return(
                     chatObj.sender == 'You' ? (
                        <ChatCardContainer key={i}>
                        <ChatCard sender >
                           <ChatCardMsg>{chatObj.msg}</ChatCardMsg>
                           <ChatCardTime>{chatObj.time}</ChatCardTime>
                        </ChatCard>
                        </ChatCardContainer>
                     ) : (
                        <ChatCardContainer key={i}>
                        <ChatCard receiver >
                           <ChatCardName>{chatObj.sender}</ChatCardName>
                           <ChatCardMsg>{chatObj.msg}</ChatCardMsg>
                           <ChatCardTime>{chatObj.time}</ChatCardTime>
                        </ChatCard>
                        </ChatCardContainer>
                     )
                  )
               })}
            </ChatContainer>
            <ChatInput sendMessage={sendMessage} />
         </Container>
      </Modal>
   )  
}

const Modal = styled.View`
   flex: 1;
   background-color: transparent;
`
const Container = styled.View`
   flex: 1;
   background-color: #202124;
   overflow: hidden;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
`
const ModalHeader = styled.View`
   flex-direction: row;
   border-bottom: 1px solid #FFFFFF;
   padding: 15px 10px;
`
const ModalHeaderText = styled.View`
   flex: 1;
`
const ModalTitle = styled.Text`
   font-size: 20px;
   font-weight: 600;
   color: #FFFFFF;
`
const ModalSubTitle = styled.Text`
   font-size: 13px;
   font-weight: 600;
   color: #9c9c9c;
`
const ChatContainer = styled.ScrollView`
   flex: 1;
   padding: 10px 10px;
`
const ChatCardContainer = styled.View`
   margin-bottom: 15px;
   flex-direction: row;
`
const ChatCard = styled.View.attrs((props: {sender:boolean,receiver:boolean}) => props)`
   border-radius: 10px;
   border-top-left-radius: ${(props) => props.receiver ? '0' : '10px'};
   border-top-right-radius: ${(props) => props.sender ? '0' : '10px'};
   background-color: ${(props) => props.receiver ? "#5F5F5F" : "#458e83"};
   padding: 5px 10px;
   max-width: 85%;
   margin-left: ${(props) => props.sender ? 'auto' : '0'};
`
const ChatCardName = styled.Text`
   font-size: 14px;
   font-weight: bold;
   color: #4AD8CA;
   margin-bottom: 3px;
`
const ChatCardMsg = styled.Text`
   font-size: 16px;
   font-weight: 400;
   color: #FFFFFF;
   line-height: 20px;
`
const ChatCardTime = styled.Text`
   font-size: 12px;
   font-weight: 400;
   color: #e4edf2;
   margin: 10px 5px 0;
   text-align: right;
`
interface chatObject {
   sender: string,
   msg: string,
   time: string
}