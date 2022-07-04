import React, { useEffect, useState } from 'react';
import { ChanelImage } from './channelDescribe';
import { Box, Button, Card, CardActions, CardContent, FormControl, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels, setPlc } from '../store/actions/user'
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import validate from "validate.js"
import { FormHelperText } from '@mui/material';


const theme = createTheme();

var constraints = {
    plcName: {
        presence: { allowEmpty: false, message: "^" + "שם הבקר חובה" },
    },
    token: { presence: { allowEmpty: false, message: "^" + "חובה Token-קוד" } },
    login: { presence: { allowEmpty: false, message: "^" + "חובה Login-קוד" } }
};

export const ControllerSetting = () => {
    const navigate = useNavigate();
    let plc = useSelector(state => state.plc)
    let user = useSelector(state => state.user)
    let channels = useSelector(state => state.channels)
    let dispatch = useDispatch()
    const [state, setState] = useState({ errors: {}, touched: {}, isValid: false });


    const [values, setValues] = useState(plc == null ? {
        plcName: '',
        token: '',
        login: '',
        numOfChannels: 0,
        userId: ''
    } : plc);
    const [arr, setArr] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const errors = validate(values, constraints);
        setState((prevState) => ({
            ...prevState,
            errors,
            isValid: !errors
        }))
    }, [values])

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setState((prevState) => ({ ...prevState, touched: { ...prevState.touched, [e.target.name]: true } }));
    }

    useEffect(() => {
        if (arr.length == 0) {
            let arrTemp = [];
            let categoryTemp = [];
            channels?.map((item) => arrTemp.push(item.name))
            setArr(arrTemp)
            channels?.map((item) => categoryTemp.push(item.category))
            setCategory(categoryTemp)
        }
    }, [])
    const fetchAddPlc = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ ...values, userId: user._id });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        let newPlc;
        await fetch('http://localhost:4500/plc/', requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); newPlc = result })
            .catch(error => console.log('error', error));
        return newPlc;
    }

    const fetchUpdatePlc = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(values);
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        let newPlc;
        await fetch(`http://localhost:4500/plc/update/${plc._id}`, requestOptions)
            .then(response => response.json())
            .then(result => { console.log(result); newPlc = result })
            .catch(error => console.log('error', error));
        return newPlc;
    }
    const fetchAddChannelList = async (arr, categories, plcId) => {
        let resChannels = [];
        console.log("fetch");
        for (let i = 0; i < arr.length; i++) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "plcId": plcId,
                "name": arr[i],
                "category": categories[i],
                "status": false,
                "channelNum":( i+1)
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            await fetch("http://localhost:4500/channel/", requestOptions)
                .then(response => response.json())
                .then(result => { resChannels.push(result); console.log(result) })
                .catch(error => console.log('error', error));
        }
        return resChannels;
    }

    const fetchUpdateChannelList = async (plcId) => {
        //todo update channels exists
        let resChannels = [];
        let rows = [];
        console.log("fetch");
        for (let i = 0; i < plc.numOfChannels; i++) {
            var raw = {
                "plcId": plcId,
                "name": arr[i],
                "category": category[i],
                "status": false,
                "channelNum": i,
                '_id': channels[i]._id,
            };
            rows.push(raw)
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(rows),
            redirect: 'follow'
        };
        await fetch(`http://localhost:4500/channel/update`, requestOptions)
            .then(response => response.json())
            .then(result => { resChannels.push(result); console.log(result) })
            .catch(error => console.log('error', error));
        return resChannels;
    }

    const handleArr = (e) => {
        let temp = new Array(e.target.value == "" ? values.numOfChannels : parseInt(e.target.value)).fill("")
        console.log("temp", temp)
        if (temp.length > values.numOfChannels) {// && values.numOfChannels > 0
            for (var i = 0; i < values.numOfChannels; i++) {
                if (i < arr.length)
                    temp[i] = arr[i]
            }
        }
        else {
            for (var i = 0; i < temp.length; i++) {
                temp[i] = arr[i]
            }
        }
        setArr([...temp])
    }
    const handleCategory = (e) => {
        let temp = new Array(e.target.value == "" ? values.numOfChannels : parseInt(e.target.value))
        console.log("categories", temp)
        if (temp.length > values.numOfChannels) {// && values.numOfChannels > 0
            for (var i = 0; i < values.numOfChannels; i++) {
                if (i < category.length)
                    temp[i] = category[i]
            }
        }
        else {
            for (var i = 0; i < temp.length; i++) {
                temp[i] = category[i]
            }
        }
        setCategory([...temp])
    }
    const hundelSaveData = async () => {
        setState((prevState) => ({ ...prevState, submitted: true }));
        if (state.isValid) {
            //addPLc
            let newPlc
            console.log(values)
            if (plc == null || plc == {})
                newPlc = await fetchAddPlc();
            else
                newPlc = await fetchUpdatePlc();
            if (plc == null) {
                const c = await fetchAddChannelList(arr, category, newPlc._id);
                dispatch(setChannels([...channels, ...c]));
            }
            else {
                const result = await fetchUpdateChannelList(newPlc._id);
                const c = result.flat();
                dispatch(setChannels([...channels.filter(chanel => !c.map(item => item._id).includes(chanel._id)), ...c]))
                if (values.numOfChannels > plc.numOfChannels) {
                    let temp = [...arr]
                    temp.splice(0, plc.numOfChannels)
                    setArr(temp)
                    let temp1 = [...category]
                    temp1.splice(0, plc.numOfChannels)
                    setCategory(temp1)
                    let added = await fetchAddChannelList(temp, temp1, newPlc._id)
                    dispatch(setChannels([...channels, ...added]))
                }
            }
            dispatch(setPlc(newPlc))
            swal({
                text: `ההגדרות נשמרו בהצלחה`,
                icon: 'success',

            });
            navigate('/')
        }
    }

    const Delete = (i) => {
        console.log(values)
        const tempArr = [...arr];
        tempArr.splice(i, 1)
        setArr(tempArr)
        const tempCategory = [...category];
        tempCategory.splice(i, 1)
        setCategory(tempCategory)
        setValues({ ...values, numOfChannels: values.numOfChannels - 1 })
    }

    return (
        <>
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
                            <BuildCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            הגדרות בקר
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name="plcName"
                                        required
                                        fullWidth
                                        id="plcName"
                                        label="שם הבקר"
                                        autoFocus
                                        dir='rtl'
                                        value={values.plcName}
                                        onChange={handleChange}
                                    />
                                    {(state.touched?.["plcName"] || state.submitted) && (<FormHelperText error>{state.errors?.["plcName"]?.[0]}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Token-קוד"
                                        name="token"
                                        value={values.token}
                                        required
                                        dir='rtl'
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                    {(state.touched?.["token"] || state.submitted) && (<FormHelperText error>{state.errors?.["token"]?.[0]}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        label="Login-קוד"
                                        name="login"
                                        value={values.login}
                                        required
                                        dir='rtl'
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                    {(state.touched?.["login"] || state.submitted) && (<FormHelperText error>{state.errors?.["login"]?.[0]}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        type="number"
                                        label="הכנס את מספר המכשירים"
                                        name="numOfChannels"
                                        onChange={(e) => {
                                            handleArr(e)
                                            handleCategory(e);
                                            setValues({ ...values, numOfChannels: e.target.value == "" ? 0 : parseInt(e.target.value) })
                                        }}
                                        required
                                        value={values.numOfChannels}
                                        variant="outlined"
                                    />
                                </Grid>
                                {(values.numOfChannels) ? (
                                    arr.map((item, index) =>
                                        <Grid spacing={3} id={index} item xs={12} sm={12}>
                                            <Card style={{ backgroundColor: 'lightgrey' }}>
                                                <CardContent>
                                                <FormControl>
                                                     <TextField
                                                            
                                                            label="מספר ערוץ"
                                                            type="number"
                                                            min="0"
                                                            value={item}
                                                            onChange={
                                                            (e) => {
                                                                let temp = [...arr];
                                                                console.log(temp);
                                                                temp[index] = e.target.value;
                                                                setArr(temp);
                                                            }
                                                        }
                                                    /> 
                                                 </FormControl>
                                                </CardContent>
                                                <CardActions>
                                                    <FormControl fullWidth>
                                                    <TextField
                                                        value={category[index]}
                                                        fullWidth
                                                        name="nameChannel"
                                                        label='קטגוריה'
                                                        required
                                                        variant="outlined"
                                                        select
                                                        onChange={(e) => {
                                                            let temp = [...category];
                                                            console.log(temp);
                                                            temp[index] = parseInt(e.target.value);
                                                            setCategory(temp);
                                                        }}
                                                    >
                                                        {ChanelImage.map((v, i) => <MenuItem value={i} >{v.name}</MenuItem>)}
                                                    </TextField>
                                                    </FormControl>
                                                    <br></br>
                                                </CardActions>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="שם המכשיר"
                                                        name="nameChannelUse"
                                                        required
                                                        value={item}
                                                        onChange={
                                                            (e) => {
                                                                let temp = [...arr];
                                                                console.log(temp);
                                                                temp[index] = e.target.value;
                                                                setArr(temp);
                                                            }
                                                        }
                                                        variant="outlined"
                                                    >
                                                    </TextField>

                                                </Grid>
                                                <br></br>
                                            </Card>
                                        </Grid>
                                    )) : <></>}


                            </Grid>

                            <Button
                                onClick={hundelSaveData}
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                שמירה
                            </Button>

                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>

        </>
    );
}
