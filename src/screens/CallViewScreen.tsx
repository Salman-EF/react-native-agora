import React, { Component, createRef } from "react"
import { PermissionsAndroid, Platform } from "react-native";
import Config from "react-native-config";
import { MaterialIcons } from '@expo/vector-icons';
import {ChannelProfileType, ClientRoleType, createAgoraRtcEngine,IRtcEngine} from 'react-native-agora'
import styled from "styled-components/native";
import CallChat from "../components/CallChat";
import CallFooter from "../components/CallFooter";
import ParticipantCard from "../components/ParticipantCard";
import { Modalize } from "react-native-modalize";
import CallDescription from "../components/CallDescription";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

interface participant {
   uid: string,
   talking: boolean,
   muted: boolean
}
interface State {
   uId: number,
   appId: string | undefined,
   channelName: string,
   token: string,
   isJoined: boolean,
   muted: boolean,
   participants: participant[],
   groupcall: {
      title: string
   },
   organizer: {
      image: string
   },
   chatVisible: boolean,
   descVisible: boolean,
   talkers: any[]
}
export default class CallViewScreen extends Component<{}, State> {
   agoraEngine?: IRtcEngine
   chatModalRef
   descModalRef
   constructor(props:any) {
      super(props);
      this.state = {
         uId: Math.floor(Math.random() * 1.0e+7),
         appId: Config.AGORA_APPID,
         channelName: 'rn_x_agora',
         token: '',
         isJoined: false,
         muted: false,
         participants: [],
         groupcall: {
            title: 'React Native Agora'
         },
         organizer: {
            image: 'https://avatars.githubusercontent.com/u/23010997?s=120'
         },
         chatVisible: false,
         descVisible: false,
         talkers: []
      };
      if (Platform.OS === 'android') {
         this.requestCameraAndAudioPermission().then(() => {
            console.log('requested!')
         })
      }
      this.chatModalRef = createRef<Modalize>();
      this.descModalRef = createRef<Modalize>();
   }

   componentDidMount() {
      this.initEngine().catch(err => console.error('Init: ',err))
   }
   componentWillUnmount() {
      deactivateKeepAwake();
   }

   initEngine = async () => {
      this.agoraEngine = await createAgoraRtcEngine();
      await this.addListeners();
      this.agoraEngine.initialize({
         appId: this.state.appId,
         channelProfile: ChannelProfileType.ChannelProfileCommunication
     });
      await this.agoraEngine.enableAudio();
   };
 
   addListeners = () => {
      this.agoraEngine?.registerEventHandler({
         onUserJoined: (conn, uid, elapsed) => {
            const {participants} = this.state
            participants.push({ uid: uid.toString(), talking: false, muted: false })
            this.setState({ participants })
         },
         onUserOffline: (conn, uid, reason) => {
            let {participants} = this.state
            participants = participants.filter(part => part.uid != uid.toString());
            this.setState({ participants })
         },
         onError: (errorCode, msg) => {
            console.info('Error', errorCode);
         },
         onJoinChannelSuccess: (conn, elapsed) => {
            this.setState({ isJoined: true });
         },
         onLeaveChannel: (stats) => {
            this.setState({ participants: [], isJoined: false, muted: false })
         }
      })

      // Speaker detection
      this.agoraEngine?.enableAudioVolumeIndication(1000, 3, true);
      this.agoraEngine?.addListener('onAudioVolumeIndication', (conn,speakers,speakerNum,totalVol) => {
         let talkers = speakers.filter(spkr => spkr!.volume > 0)
         this.setState({ talkers: talkers })
      })
      setInterval(() => {
         let {participants} = this.state
         participants.map(part => {
            const isTalking = this.state.talkers.filter(tlkr => tlkr.uid.toString() == part.uid)
            part.talking = isTalking.length > 0
         })
         this.setState({ participants })
      }, 1000)

      // Muted detection
      this.agoraEngine?.addListener('onUserMuteAudio', (conn, uid, muted) => {
         let {participants} = this.state
         participants.map(part => {
            if(part.uid == uid.toString()) part.muted = muted
         })
         this.setState({ participants })
      })
   };

   requestCameraAndAudioPermission = async () => {
      try {
         const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
         ])
         if (
            granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
         ) {
            console.log('You can use the cameras & mic')
         } else {
            console.log('Permission denied')
         }
      } catch (err) {
         console.warn(err)
      }
   }

   renderRemoteAudioCards = () => {
      return (
         <>
         {this.state.participants.map((part) => {
            return (
               <ParticipantCard uid={part.uid} talker={part.talking} muted={part.muted} key={part.uid} />
            )
         })}
         </>
      )
   }

   renderAudioCards = () => {
      const {isJoined} = this.state
      return isJoined ? (
         <>
            <ParticipantCard uid="You" muted={this.state.muted} />
            {this.renderRemoteAudioCards()}
         </>
      ) : null
   }

   toggleChatModal = () => {
      this.state.chatVisible ? this.chatModalRef.current?.close() : this.chatModalRef.current?.open()
      return false;
   }
   
   toggleDescModal = () => {
      this.state.descVisible ? this.descModalRef.current?.close() : this.descModalRef.current?.open()
      return false;
   }

   generateAgoraToken = async () => {
      var formdata = new FormData();
      formdata.append('uId', this.state.uId.toString());
      formdata.append('channel', this.state.channelName);
      var fetchOptions = {
         method: 'POST',
         body: formdata
      };

      await fetch(`${Config.API_BASE_URL}/agora_generate_token`, fetchOptions)
         .then(response => response.json())
         .then(res => {
            if (res.status == 1) this.setState({ token: res.token })
            else this.setState({ token: '' })
         })
   }

   joinChannel = async () => {
      try {
         await this.generateAgoraToken();
         await this.agoraEngine?.joinChannel(this.state.token,this.state.channelName,this.state.uId,{})
         // After the user joined the screen should not sleep
         activateKeepAwake();
      } catch (err) {
         console.error('Join channel: ',err)
      }
   }

   leaveChannel = async () => {
      try {
         await this.agoraEngine?.leaveChannel()
         // After the user left the screen sleep back to default
         deactivateKeepAwake();
      } catch (err) {
         console.log('Leave channel: ',err)
      }
   }

   muteLocal = async () => {
      try {
         await this.agoraEngine?.muteLocalAudioStream(!this.state.muted);
         this.setState((prevState) => ({ muted:!prevState.muted }))
      } catch (err) {
         console.log('Mute: ',err)
      }
   }
   
   render() {
      return (
         <Container>
            <TitleRow>
               <Title>{this.state.groupcall.title}</Title>
               <OrganizerImage source={{uri:this.state.organizer.image}} />
            </TitleRow>
            <CardsRow>
            {this.renderAudioCards()}
            </CardsRow>
            <DescButtonContainer>
               <DescButton onPress={this.toggleDescModal}><DescButtonText>Description </DescButtonText><MaterialIcons name="keyboard-arrow-up" size={26} color="#7F7F7F" /></DescButton>
            </DescButtonContainer>
            <Modalize ref={this.chatModalRef} modalStyle={{ flex: 1 }}
               scrollViewProps={{ contentContainerStyle: { height: '100%' }, keyboardShouldPersistTaps: "always" }} withHandle={false}
               onClosed={() => this.setState({ chatVisible:false })} onOpened={() => this.setState({ chatVisible:true })} 
            >
               <CallChat groupcall={this.state.groupcall} toggleChatModal={this.toggleChatModal} />
            </Modalize>
            <Modalize ref={this.descModalRef} modalStyle={{ flex: 1, marginTop: 100, backgroundColor: "transparent" }} handleStyle={{ backgroundColor: "#bdc1c6" }}
               scrollViewProps={{ contentContainerStyle: { height: '100%' } }} handlePosition={'inside'} withHandle={true}
               onClosed={() => this.setState({ descVisible:false })} onOpened={() => this.setState({ descVisible:true })} 
            >
               <CallDescription groupcall={this.state.groupcall} toggleDescModal={this.toggleDescModal} />
            </Modalize>
            <CallFooter 
               join={this.joinChannel} leave={this.leaveChannel} isJoined={this.state.isJoined}
               muted={this.state.muted} toggleMic={this.muteLocal}
               toggleChatModal={this.toggleChatModal} />
         </Container>
      );
   }
}

const Container = styled.View`
   flex:1;
   background-color:#202124;
   padding: 20px 0 0;
`
const TitleRow = styled.View`
   padding: 0 15px;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
`
const Title = styled.Text`
   font-size:22px;
   font-weight: 600;
   color:#ffffff;
`
const OrganizerImage = styled.Image`
   width: 36px;
   height: 36px;
   border-radius: 50px;
`
const CardsRow = styled.View`
   flex: 1;
   padding: 30px 10px;
   flex-direction: row;
   align-items: center;
   flex-wrap: wrap;
`
const DescButtonContainer = styled.View`
   flex-direction: row;
   justify-content: center;
   align-items: center;
`
const DescButton = styled.TouchableOpacity`
   padding: 5px 15px;
   background-color: #D9D9D9;
   border-radius: 50px;
   margin-bottom: 15px;
   flex-direction: row;
   justify-content: center;
   align-items: center;
`
const DescButtonText = styled.Text`
   font-size: 16px;
   font-weight: 600;
   color: #7F7F7F;
`