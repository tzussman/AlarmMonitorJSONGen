import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';

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
            inStream: false
        }
        this.json_text = "{\n  \"rooms\": [\n    {\n";
        this.firstRoom = true;
        this.firstStreamInRoom = true;
        this.inRoom = true;
        this.inStream = false;

        this.appendText = this.appendText.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.handleStreamChange = this.handleStreamChange.bind(this);
        this.handleStreamAddressChange = this.handleStreamAddressChange.bind(this);
        this.addObject = this.addObject.bind(this);
        this.addRoom = this.addRoom.bind(this);
        this.addStream = this.addStream.bind(this);
        this.download = this.download.bind(this);
    }

    appendText(text) {
        this.json_text = this.json_text + text;
    }

    handleRoomChange(event) {
        this.setState({roomValue: event.target.value});
    }

    handleStreamChange(event) {
        this.setState({streamValue: event.target.value});
    }

    handleStreamAddressChange(event) {
        this.setState({streamAddressValue: event.target.value});
    }

    addRoom(event) {


        this.addObject();

        this.setState({
            roomValue: '',
            streamValue: '',
            streamAddressValue: '',
            inRoom: true,
            inStream: false
        });
        this.firstStreamInRoom = true;
    }

    addStream(event) {


        this.addObject();

        this.setState({
            roomValue: '',
            streamValue: '',
            streamAddressValue: '',
            inRoom: false,
            inStream: true
        });
    }

    addObject() {
        if (this.state.inRoom) {
            let toAppend = "      \"identifier\": \"" + this.state.roomValue + "\",\n      \"streams\": [\n";
            if (this.firstRoom) {
                this.appendText(toAppend);
                this.firstRoom = false;
            }
            else {
                let begin = "\n      ]\n    },\n    {\n";
                this.appendText(begin + toAppend);
            }
        }
        else {
            let toAppend = "        {\n          \"name\": \"" + this.state.streamValue + "\",\n          \"streamLink\": \"" +
            this.state.streamAddressValue + "\"\n        }";
            if (this.firstStreamInRoom) {
                this.appendText(toAppend)
                this.firstStreamInRoom = false;
            }
            else {
                let begin = ",\n";
                this.appendText(begin + toAppend);
            }
        }
    }

    download(event) {
        event.preventDefault();
        this.addObject();
        this.appendText("\n      ]\n    }\n  ]\n}\n");
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.json_text));
        element.setAttribute('download', 'streamInfo.json');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        this.setState({inRoom: false, inStream: false});
    }

    render() {

        const buttons = 
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                <Button onClick={this.addRoom}>Add Room</Button>
                <Button onClick={this.addStream}>Add Stream</Button>
                <Button onClick={this.download}>Finish and download</Button>
            </ButtonGroup>

        const roomForm = 
            <form noValidate autoComplete="off">
                <TextField id="room_name_input" name="roomName" label="Room name" value={this.state.roomValue} onChange={this.handleRoomChange} />
                {buttons}
            </form>;

        const streamForm = 
            <form noValidate autoComplete="off">
                <TextField id="stream_name_input" name="streamName" label="Stream name" value={this.state.streamValue} onChange={this.handleStreamChange} />
                <TextField id="stream_link_input" name="streamLink" label="Stream link" value={this.state.streamAddressValue} onChange={this.handleStreamAddressChange} />
                {buttons}
            </form>;

        
        var form;
        if (this.state.inRoom) {
            form = roomForm;
        }
        else {
            form = streamForm;
            // Add download screen here
        }

        return (
            <div>
                <h2>Welcome to JSON Generator</h2>

                {form}
            </div>
        );
    }
}

export default JSONGenerator;