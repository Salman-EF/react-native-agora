import React from "react"
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from "react-native";

export default function ParticipantCard(props:any) {
   const state = {
      participant: {
         image: 'https://avatars.githubusercontent.com/u/23010997?s=120'
      }
   };
   
   const ParticipantCard = styled.View`
      width: 33.33%;
      margin-bottom: 20px;
      justify-content: center;
      align-items: center;
   `
   const ParticipantImageContainer = styled.View`
      padding: 2px;
      border-radius: 50px;
      border: 4px solid transparent;
      border-color: ${props.talker ? "#4db69785" : "transparent"};
   `
   const ParticipantImage = styled.Image`
      width: 76px;
      height: 76px;
      border-radius: 50px;
   `
   const ParticipantName = styled.Text`
      font-size: 14px;
      font-weight: 400;
      color:#ffffff;
   `
   const ParticipantMic = styled.View`
      display: ${props.muted ? "flex" : "none"};
      background-color: #DADADABF;
      border: 1px solid #022541;
      border-radius: 50px;
      padding: 2px;
      position: absolute;
      right: 0;
      bottom: 0;
   `
   
   return (
      <ParticipantCard>
         <View>
            <ParticipantImageContainer>
               <ParticipantImage source={{uri:state.participant.image}} />
            </ParticipantImageContainer>
            <ParticipantMic>
               <MaterialCommunityIcons name="microphone-off" size={16} color="#022541" />
            </ParticipantMic>
         </View>
         <ParticipantName>{props.uid}</ParticipantName>
      </ParticipantCard>
   );
 }