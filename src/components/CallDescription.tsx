import React, { Fragment, useState } from 'react';
import styled from 'styled-components/native';

export default function CallDescription(props:any) {
   const [questions] = useState([
      { 
         lang: "English", 
         questions: [ "1- What is the meaning of the word “adoption”?", "2- Do you have a friend who was adopted as a child?", "3- Do you know anyone who has adopted a child?", "4- In your opinion, what is the main reason that makes people choose to adopt? Do you know any other reasons?", "5- What is the difference between domestic and international adoption?", "6- How is adoption seen in your country?", "7- What are the procedures for someone to adopt a child?", "8- How do you go about adopting a child" ]
      },
      { 
         lang: "Arabic", 
         questions: [ "1- ما معنى كلمة \"تبني\"؟", "2- هل لديك صديق تم تبنيه عندما كان طفلاً؟", "3- هل تعرف أي شخص تبنى طفلاً؟", "4- ما هو برأيك السبب الرئيسي الذي يجعل الناس يختارون التبني؟ هل تعرف أي أسباب أخرى؟", "5- ما هو الفرق بين التبني المحلي والدولي؟", "6- كيف يُنْظَرُ إلى التبني في بلدك؟", "7 ما هي الإجراءات لشخص يتبنى طفلاً؟", "8- كيف تتجه نحو تبني طفل؟" ]
      }
   ])
   

   return (
      <Modal>
         <Container>
            <ModalHeader>
               <ModalHeaderText>
                  <ModalTitle>Description</ModalTitle>
               </ModalHeaderText>
            </ModalHeader>
            <QuestionsView>
               {questions.map((qtObject,i) => {
                  return(
                     <Fragment key={i}>
                        <LanguageLabel>{qtObject.lang}</LanguageLabel>
                        {qtObject.questions.map((qt,i) => {
                           return(
                              <Question key={i}>{qt}</Question>
                           )
                        })}
                     </Fragment>
                  )
               })}
            </QuestionsView>
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
`
const ModalHeaderText = styled.View`
   flex: 1;
   margin: 15px 0 10px;
`
const ModalTitle = styled.Text`
   font-size: 18px;
   font-weight: 600;
   color: #FFFFFF;
   text-align: center;
`
const QuestionsView = styled.ScrollView`
   flex: 1;
   padding: 0 15px;
`
const LanguageLabel = styled.Text`
   font-size: 16px;
   font-weight: bold;
   color: #FFFFFF;
   margin: 20px 0 10px;
`
const Question = styled.Text`
   font-size: 16px;
   font-weight: 400;
   color: #FFFFFF;
   line-height: 25px;
   margin-bottom: 15px;
`