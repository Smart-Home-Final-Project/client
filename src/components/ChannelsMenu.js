import * as React from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setChannels } from '../store/actions/user';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';

//icon
import HighlightIcon from '@mui/icons-material/Highlight';
import WindPowerIcon from '@mui/icons-material/WindPower';
import WindowIcon from '@mui/icons-material/Window';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import DeblurIcon from '@mui/icons-material/Deblur';


export const ChannelsMenu = () => {
    let plc = useSelector(state => state.plc)
    let channels = useSelector(state => state.channels)
    const icon = [<HighlightIcon />, <WindPowerIcon />, <WindowIcon />, <AccessAlarmsIcon />, <MusicVideoIcon />, <DeblurIcon />];
    let dispatch = useDispatch()

    //fetchUpdate
    const fetchUpdate = async (channel, index) => {
        var channelUpdate
        var statusCheck = channel.status == false ? true : false;
        channel.status = statusCheck;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(channel)
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        await fetch(`http://localhost:4500/channel/update/${channel._id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                channelUpdate = result
                console.log("after update" + result)
            })
            .catch(error => console.log('error', error));
        let temp = [...channels]
        temp[index] = channelUpdate
        dispatch(setChannels(temp))
    }

    //turn on
    const fetchOn = async (channel) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(channel)

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let r;
        await fetch(`http://localhost:4500/channel/switchToOn?channel=${channel.channelNum}&login=${plc.login}&token=${plc.token}`, requestOptions)
            .then(result => r = result)
            .catch(error => console.log('error', error));
        console.log("after turn on" + r)
    }

    //turn on channel and update the status
    const handleOn = async (channel, index) => {
        await fetchOn(channel)
        await fetchUpdate(channel, index)
        console.log(channel)
    }

    //turn off
    const fetchOff = async (channel) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(channel)

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let r

        await fetch(`http://localhost:4500/channel/switchToOff?channel=${channel.channelNum}&login=${plc.login}&token=${plc.token}`, requestOptions)
            .then(result => r = result)
            .catch(error => console.log('error', error));
        console.log("after turn off" + r)
    }

    //turn off channel and update the status
    const handelOff = async (channel, index) => {
        await fetchOff(channel)
        await fetchUpdate(channel, index)
        console.log(channel)
    }

    return (
        <Grid sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center' }} spacing={3}>

            {channels.map((channel, index) => (
                <Grid key={channel._id} spacing={4} padding={3}>
                    <Card sx={{ minWidth: 155, minHeight: 160 }} defaultChecked={channel.status}
                        style={{ backgroundColor: channel.status ? 'lightgrey' : 'white' }} onClick={() => {
                            channel.status ?
                                handelOff(channel, index) : handleOn(channel, index)
                        }
                        }
                    >
                        <CardActionArea sx={{ alignItems: 'center' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <Avatar sx={{ alignSelf: 'center' }}>
                                        {icon[channels[index].category]}
                                    </Avatar>
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div">
                                    {channels[index].name}
                                </Typography>
                                <Typography>
                                    {channel.status ? 'פועל' : 'כבוי'}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

            ))
            }
        </Grid >
    )
}
