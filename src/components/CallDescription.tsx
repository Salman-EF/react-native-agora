import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import styled from 'styled-components/native';

export default function CallDescription(props:any) {
   const [matches] = useState([
      { against: "🇭🇷  Croatia", score: "2-1" } ,
      { against: "🇫🇷  France", score: "2-0" } ,
      { against: "🇵🇹  Portugal", score: "0-1" },
      { against: "🇪🇸  Spain", score: "0-3" },
      { against: "🇨🇦  Canada", score: "1-2" },
      { against: "🇧🇪  Belgium", score: "0-2" },
      { against: "🇭🇷  Croatia", score: "0-0" }
   ])
   

   return (
      <Modal>
         <Container>
         <ImageBackground source={require('../../assets/siir_siir.jpeg')} style={{width: '100%', height: '100%'}}>
            <ModalHeader>
               <ModalHeaderText>
                  <ModalTitle>🇲🇦 🇲🇦 🥑 🇲🇦 🇲🇦</ModalTitle>
               </ModalHeaderText>
            </ModalHeader>
            <MatchesView>
               {matches.map((match,i) => {
                  return(
                     <CallCard key={i}>
                        <CardContainer>
                           <CardBody>
                              <Against>{match.against}</Against>
                              <Score>{match.score}</Score>
                           </CardBody>
                        </CardContainer>
                     </CallCard>
                  )
               })}
            </MatchesView>
         </ImageBackground>
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
   background-color: #1e2024;
   margin: 0 5px;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
`
const ModalHeader = styled.View`
   flex-direction: row;
   border-bottom: 1px solid #FFFFFF;
   padding: 10px 10px;
   margin-bottom: 20px;
`
const ModalHeaderText = styled.View`
   flex: 1;
   margin: 15px 0 10px;
`
const ModalTitle = styled.Text`
   font-size: 26px;
   font-weight: 600;
   color: #FFFFFF;
   text-align: center;
`
const MatchesView = styled.ScrollView`
   flex: 1;
   padding: 0 15px;
`
const CallCard = styled.View`
   width: 100%;
   background-color: #FFFFFF;
   border-radius: 30px;
   overflow: hidden;
   margin-bottom: 15px;
`
const CardContainer = styled.View`
   flex-direction: row;
   align-items: flex-start;
`
const CardBody = styled.View`
   width: 100%;
   padding: 15px;
   flex-direction: row;
   justify-content: space-around;
`
const Against = styled.Text`
   font-size: 20px;
   font-weight: bold;
   color: #5f6570;
   text-align: center;
   margin-right: 5px;
`
const Score = styled.Text`
   font-size: 20px;
   font-weight: 400;
   color: #6d7c90;
   text-align: center;
`