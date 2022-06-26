import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'
import { setActioAlerts, setChannels, setGroups } from '../store/actions/user';
import swal from 'sweetalert';

const theme = createTheme();

const fetchAddNewAlert = async (newA) => {

    let res;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(newA);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("http://localhost:4500/actionAlert/add", requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));
    console.log(res)
    return res;
}

const fetchUpdateAlert = async (a) => {

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

    await fetch(`http://localhost:4500/actionAlert/update/${a._id}`, requestOptions)
        .then(response => response.json())
        .then(result => res = result)
        .catch(error => console.log('error', error));

    return res;
}

export default function NewActionAlert(props) {
    const location = useLocation();
    let navigate = useNavigate()
    const [newAlert, setNewAlert] = useState(location.state != null ? location.state.alert : { status: false, days: [false, false, false, false, false, false, false] });
    const [days, setDays] = useState(newAlert.frequency == 'by days');
    let channels = useSelector(state => state.channels)
    let groups = useSelector(state => state.groups)
    let actionAlerts = useSelector(state => state.actionAlert)
    let user = useSelector(state => state.user)
    let dispatch = useDispatch()
    const defaultFreq = newAlert.frequency;

    const handleSubmit = (event) => {
        event.preventDefault();
        const f = async () => {
            let isNew = location.state == null;
            let alertJson = newAlert;
            alertJson.userId = user._id;
            console.log(alertJson)
            let result;
            if (isNew) {
                result = await fetchAddNewAlert(alertJson)
                dispatch(setActioAlerts([...actionAlerts, result]))
                swal({
                    text: `שעון חדש נוסף בהצלחה`,
                    icon: 'success',

                });
            }
            else {
                result = await fetchUpdateAlert(alertJson)
                let tempArr = actionAlerts.filter(e => e._id != result._id);
                tempArr = [...tempArr, result]
                dispatch(setActioAlerts(tempArr))
                swal({
                    text: `השעון עודכן בהצלחה`,
                    icon: 'success',

                });
            }
            console.log(result)
            navigate('/')
            return result;
        }
        f()

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        direction: 'rtl'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <AccessTimeFilledIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        שעון חדש
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="alertName"
                                    required
                                    fullWidth
                                    id="alertName"
                                    label="שם שעון"
                                    autoFocus
                                    dir='rtl'
                                    value={newAlert.name}
                                    onChange={(e) => { setNewAlert({ ...newAlert, name: e.target.value }) }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="זמן הדלקה"
                                        value={newAlert.timeStart}
                                        onChange={(newValue) => {
                                            setNewAlert({ ...newAlert, timeStart: newValue })
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="זמן כיבוי"
                                        value={newAlert.timeEnd}
                                        onChange={(newValue) => {
                                            setNewAlert({ ...newAlert, timeEnd: newValue })
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl sx={{ m: 1, minWidth: 220 }}>
                                    <InputLabel htmlFor="grouped-select">בחר ערוץ / קבוצה</InputLabel>
                                    <Select name="idChannel" id="grouped-select" label="בחר ערוץ/קבוצה" onChange={(e) => { setNewAlert({ ...newAlert, idChannel: e.target.value }) }}>
                                        <ListSubheader>ערוצים </ListSubheader>
                                        {
                                            channels != null ? channels.map(
                                                (c, i) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>

                                            ) : <MenuItem value=''><Button onClick={() => {navigate('/ControllerSetting') }}>הגדר ערוצים</Button></MenuItem>
                                        }
                                        <ListSubheader>קבוצות מוגדרות</ListSubheader>
                                        {
                                            groups != null ? groups.map(
                                                c => <MenuItem key={c._id} value={c._id}>{c.groupName}</MenuItem>

                                            ) : <MenuItem value=''><Button onClick={() => {navigate('/newGroup') }}>הגדר קבוצות</Button></MenuItem>
                                        }
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12} >
                                <FormControl >
                                    <FormLabel id="label-frequency-alert">חזרה</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="radio-frequency"
                                        defaultValue={defaultFreq}
                                        name="frequency"
                                        onChange={(e) => { e.target.value == 'by days' ? setDays(true) : setDays(false); setNewAlert({ ...newAlert, frequency: e.target.value }) }}
                                    >
                                        <FormControlLabel value="once" control={<Radio />} label="ללא חזרה" />
                                        <FormControlLabel value="daily" control={<Radio />} label="יומי" />
                                        <FormControlLabel value="by days" control={<Radio />} label="בחר ימים" />

                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {days &&
                                <Grid item xs={12}>
                                    <ToggleButtonGroup

                                        //onChange={}
                                        aria-label="text formatting"
                                    >
                                        <ToggleButton
                                            selected={newAlert.days[0]}
                                            value={0}
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[0] = !temp[0];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}
                                            aria-label="1">
                                            א
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[1]} value={1} aria-label="ב"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[1] = !temp[1];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ב
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[2]} value={2} aria-label="ג"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[2] = !temp[2];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ג
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[3]} value={3} aria-label="ד"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[3] = !temp[3];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ד
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[4]} value={4} aria-label="ה"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[4] = !temp[4];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ה
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[5]} value={5} aria-label="ו"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[5] = !temp[5];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ו
                                        </ToggleButton>
                                        <ToggleButton selected={newAlert.days[6]} value={6} aria-label="ז"
                                            onClick={(e) => {
                                                let temp = newAlert.days;
                                                temp[6] = !temp[6];
                                                setNewAlert({ ...newAlert, days: temp })
                                            }}>
                                            ז
                                        </ToggleButton>

                                    </ToggleButtonGroup>
                                </Grid>}
                        </Grid>
                        <Grid>
                            <FormControlLabel
                                label={newAlert.status && "סטטוס שעון: פועל" ||
                                    newAlert.status == false && "סטטוס שעון: כבוי"}
                                control={

                                    <Switch
                                        checked={newAlert.status}
                                        onChange={(e) => {
                                            console.log(e.target.checked);
                                            setNewAlert({ ...newAlert, status: e.target.checked })
                                        }}
                                    />
                                } />
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            שמור
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}