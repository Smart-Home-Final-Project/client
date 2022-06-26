import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppIcon from '@mui/icons-material/Apps'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window'
import AddAndDeleteButtons from './AddAndDeleteButtons';
import { useLocation } from 'react-router-dom'
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { setChannels, setGroups } from '../store/actions/user';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    direction: 'rtl',
});

const fetchAddNewGroup = async (newG) => {
    console.log(newG)
    let res;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(newG);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("http://localhost:4500/ChannelGroup", requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    return res;
}

const fetchUpdateGroup = async (a) => {

    let res;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(a);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch(`http://localhost:4500/ChannelGroup/update/${a._id}`, requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));

    return res;
}

export default function NewGroup(props) {
    let location = useLocation();
    const [newGroup, setNewGroup] = useState(location.state != null ? location.state.group : {});
    const [isExist, setIsExist] = useState([]);
    const [first, setFirst] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState([]);
    let indexes = [...selectedIndex];
    let channels = useSelector(state => state.channels)
    let groupsRedux = useSelector(state => state.groups);
    let user = useSelector(state => state.user);
    let dispatch = useDispatch()
    let navigate = useNavigate()

    function renderRow(props) {
        const { index, style } = props;
        function setSelectedRow(index) {
            setSelectedIndex([...selectedIndex, index])
        }
        function deleteSelectedRow(index) {
            let arr = selectedIndex.filter(x => x != index)
            setSelectedIndex(arr)
        }
        return (
            <ListItem style={{ ...style, backgroundColor: `${indexes.includes(index) ? 'lightgray' : 'white'}` }} key={index} component="div" disablePadding>
                <ListItemButton>
                    <AddAndDeleteButtons arrExist={isExist} setExist={setIsExist} index={index} setSelected={setSelectedRow} deleteSelected={deleteSelectedRow} />
                    <ListItemText style={{ textAlign: 'right' }} primary={channels[index].name} />
                </ListItemButton>
            </ListItem>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let listChannelSubmit = channels.filter((c, i) => isExist[i] == true)
        console.log(listChannelSubmit)
        let temp = { ...newGroup, listChannels: listChannelSubmit, userId: user._id }
        const f = async () => {
            let isNew = location.state == null;
            let groupJson = temp;
            let result;
            if (isNew) {
                result = await fetchAddNewGroup(groupJson)
                swal({
                    text: `קבוצה '${groupJson.groupName}' נוספה בהצלחה!`,
                    icon: 'success',

                });
                console.log(groupsRedux)
                dispatch(setGroups([...groupsRedux, result]))
            }
            else {
                result = await fetchUpdateGroup(groupJson)
                swal({
                    text: `קבוצה '${groupJson.groupName}' עודכנה בהצלחה!`,
                    icon: 'success',

                });
                let groupsArr = groupsRedux.filter(e => e._id != groupJson._id)
                groupsArr = [...groupsArr, result]
                console.log(groupsArr)
                dispatch(setGroups(groupsArr))
            }
            console.log("result")
            console.log(result)
            return result;
        }
        let res = await f()
        console.log(res)
        navigate('/groups')
    };

    React.useEffect(() => {
        const fetchAndSet = async () => {
            // let c = await fetchChannels(plc);
            // dispatch(setChannels(c))
            if (location.state == null)
                setIsExist(new Array(channels.length).fill(false))
            else {
                let arrTemp = new Array(channels.length).fill(false)
                arrTemp.forEach((item, i) => {
                    if (location.state.group.listChannels.findIndex(x => x._id == channels[i]._id) != -1) {
                        indexes = [...indexes, i];
                        setSelectedIndex(indexes)
                        arrTemp[i] = true;
                    }
                })
                console.log(indexes)
                setIsExist(arrTemp)
            }
        }
        if (first) {
            fetchAndSet();
            setFirst(false);
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" dir='rtl'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        direction: 'rtl'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AppIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        עריכת קבוצה
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="groupName"
                                    required
                                    fullWidth
                                    id="groupName"
                                    label="שם הקבוצה"
                                    autoFocus
                                    dir='rtl'
                                    value={newGroup.groupName}
                                    onChange={(e) => { setNewGroup({ ...newGroup, groupName: e.target.value }) }}
                                />
                            </Grid>
                            <Box
                                sx={{ minWidth: 400, height: 400, maxWidth: 600, bgcolor: 'background.paper' }}
                            >
                                <FixedSizeList
                                    height={300}
                                    width={400}
                                    itemSize={46}
                                    itemCount={channels != null ? channels.length : 0}
                                    overscanCount={5}
                                >
                                    {renderRow}
                                </FixedSizeList>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={newGroup.groupName == undefined || newGroup.groupName == ""}
                                >
                                    שמור
                                </Button>
                            </Box>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}