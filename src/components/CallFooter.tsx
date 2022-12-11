import React from "react"
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function CallFooter(props:any) {
   const state = {
   };
   
   if(props.isJoined) {
      return (
         <Container>
            <FooterButtonsContainer>
               <ButtonsContainer>
                  <CallButton onPress={props.toggleChatModal}><MaterialIcons name="chat" size={26} color="#7F7F7F" /></CallButton>
                  <CallButton onPress={props.toggleMic}><MaterialCommunityIcons name={props.muted ? "microphone-off" : "microphone"} size={26} color="#7F7F7F" /></CallButton>
               </ButtonsContainer>
               <LeaveButton onPress={props.leave}><MaterialIcons name="call-end" size={26} color="#ffffff" /><LeaveButtonText>  Leave</LeaveButtonText></LeaveButton>
            </FooterButtonsContainer>
         </Container>
      );
   } else {
      return (
         <Container>
               <JoinButton onPress={props.join}><JoinButtonText>Join</JoinButtonText></JoinButton>
         </Container>
      )
   }
}
   
const Container = styled.View`
   padding: 10px 15px 20px;
`
const FooterButtonsContainer = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`
const JoinButton = styled.TouchableOpacity`
   padding: 5px 15px;
   background-color: #4DB6AC;
   border-radius: 50px;
   flex-direction: row;
   justify-content: center;
   align-items: center;
`
const JoinButtonText = styled.Text`
   font-size: 22px;
   font-weight: bold;
   color: #ffffff;
`
const ButtonsContainer = styled.View`
   flex-direction: row;
   align-items: center;
`
const CallButton = styled.TouchableOpacity`
   width: 42px;
   height: 42px;
   margin-right: 15px;
   background-color: #D9D9D9;
   border-radius: 50px;
   justify-content: center;
   align-items: center;
`
const LeaveButton = styled.TouchableOpacity`
   padding: 5px 15px;
   background-color: #CB231E;
   border-radius: 50px;
   flex-direction: row;
   justify-content: center;
   align-items: center;
`
const LeaveButtonText = styled.Text`
   font-size: 16px;
   font-weight: 600;
   color: #ffffff;
`