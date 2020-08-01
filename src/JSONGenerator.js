import React from 'react';
import styled from 'styled-components';
import { Button, Tabs, Tab, AppBar, TextField } from '@material-ui/core';
import ColumbiaLogo from "./Columbia_University_Logo-white_small.png";

const NO_ROOM = "None";

const PageContainerDiv = styled.div`
  position: relative;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  background-color: #022169;
  width: 100%;
  height: 7vh;
  justify-content: flex-end;
  align-items: center;
`;

const Logo = styled.img`
  height: 4vh;
  width: auto;
  padding-right: 5px;
`;

const TextDiv = styled.div`
  display: flex;
  align-content: center;
`;

const ButtonDiv = styled.div`
  margin-top: 10px;
  margin-left: 6px;
`;

const TabContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

const TabBarContainer = styled.div`
  padding-bottom: 10px;
`;

const FormContainer = styled.div`
  padding-left: 15px;
`;

const NotificationParagraph = styled.p`
  margin-top: 0px;
`;

class JSONGenerator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numRooms: 0,
      numStreams: 0,
      roomValue: '',
      streamValue: '',
      streamAddressValue: '',
      inRoom: true,
      inStream: false,
      currentRoom: NO_ROOM,
      roomCount: 0
    }
    this.json_object = { "rooms": [] }

    this.appendText = this.appendText.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleStreamChange = this.handleStreamChange.bind(this);
    this.handleStreamAddressChange = this.handleStreamAddressChange.bind(this);
    this.addObject = this.addObject.bind(this);
    this.download = this.download.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  appendText(text) {
    this.json_text = this.json_text + text;
  }

  handleRoomChange(event) {
    this.setState({ roomValue: event.target.value });
  }

  handleStreamChange(event) {
    this.setState({ streamValue: event.target.value });
  }

  handleStreamAddressChange(event) {
    this.setState({ streamAddressValue: event.target.value });
  }

  addObject(addingRoom) {
    if (this.state.inRoom) {
      this.json_object["rooms"].push({ "identifier": this.state.roomValue, "streams": [] });
      this.setState({
        currentRoom: this.state.roomValue,
        roomCount: this.state.roomCount + 1
      });
    }
    else {
      let rooms = this.json_object["rooms"];
      let streams = rooms[rooms.length - 1]["streams"];
      streams.push({ "name": this.state.streamValue, "streamLink": this.state.streamAddressValue });
    }

    this.setState({
      roomValue: '',
      streamValue: '',
      streamAddressValue: '',
      inRoom: false,
      inStream: true
    });
  }

  download(event) {
    event.preventDefault();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.json_object, null, 2)));
    element.setAttribute('download', 'streamInfo.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    this.setState({ inRoom: true, inStream: false, currentRoom: NO_ROOM, roomCount: 0 });
    this.json_object = { "rooms": [] }
  }

  handleTabChange(event, index) {
    var iRoom = (index === 0);
    this.setState({
      inRoom: iRoom,
      inStream: (index === 1)
    });
  }

  render() {
    const buttons =
      this.state.inRoom
        ? <Button onClick={() => this.addObject(true)} style={{ background: '#022169', color: 'white' }}>
            Add Room
          </Button>
        :
        (this.state.inStream ?
          <Button onClick={() => this.addObject(false)} style={{ background: '#022169', color: 'white' }}>
            Add Stream
          </Button>
          :
          <Button onClick={this.download} style={{ background: '#022169', color: 'white' }}>
            Download and start over
          </Button>
        );

    const roomForm =
      <form noValidate autoComplete="off">
        <NotificationParagraph>Number of Rooms Added: {this.state.roomCount}</NotificationParagraph>
        <TextDiv>
          <TextField id="room_name_input" name="roomName" label="Room name" value={this.state.roomValue}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                this.addObject(true);
              }
            }}
            onChange={this.handleRoomChange}
          />
          <ButtonDiv>
            {buttons}
          </ButtonDiv>
        </TextDiv>

      </form>;

    const streamForm =
      <form noValidate autoComplete="off">
        <NotificationParagraph>Current Room: {this.state.currentRoom}</NotificationParagraph>
        {this.state.currentRoom !== NO_ROOM ?
          <TextDiv>
            <TextField id="stream_name_input" name="streamName" label="Stream name" value={this.state.streamValue}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.addObject(false);
                }
              }}
              onChange={this.handleStreamChange}
            />
            <TextField id="stream_link_input" name="streamLink" label="Stream link" value={this.state.streamAddressValue}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.addObject(false);
                }
              }}
              onChange={this.handleStreamAddressChange} 
            />
            <ButtonDiv>
              {buttons}
            </ButtonDiv>
          </TextDiv>
          : <p>Please add a room to add streams.</p>
        }
      </form>;

    var form = this.state.inRoom ? roomForm : (this.state.inStream ? streamForm : buttons)

    return (
      <PageContainerDiv>
        <TabContainer>
          <h2>Alarm Monitoring System JSON Generator</h2>
          <TabBarContainer>
            <AppBar value="mainTabs" position="static">
              <Tabs value={(this.state.inRoom === true) ? 0 : (this.state.inStream === true ? 1 : 2)} onChange={this.handleTabChange} aria-label="simple tabs example"
                style={{ background: '#022169' }}>
                <Tab label="Rooms" />
                <Tab label="Streams" />
                <Tab label="Download" />
              </Tabs>
            </AppBar>
          </TabBarContainer>
          <FormContainer>
            {form}
          </FormContainer>
        </TabContainer>

        <Footer>
          <Logo src={ColumbiaLogo} alt="Columbia Logo" />
        </Footer>
      </PageContainerDiv>
    );
  }
}

export default JSONGenerator;
