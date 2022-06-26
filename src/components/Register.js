import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPlc, fetchActionAlert, fetchChannels, fetchGroups } from './fetch';
import { setActioAlerts, setChannels, setGroups, setPlc, setUser } from '../store/actions/user';
import validate from "validate.js"
import { FormHelperText } from '@mui/material';

var constraints = {
  email: {
    email: { message: "^"+"מיל לא תקין"},
    presence: {allowEmpty: false,message: "^"+"שדה חובה"},
  },
  password:{presence: {allowEmpty: false,message: "^"+"סיסמא חובה"},length: {minimum: 8,message:"^"+"אורך סיסמא לפחות 8 תווים"}},
  userName:{presence: {allowEmpty: false,message: "^"+"שם משתמש חובה"}},
  institutionId:{numericality: {
    onlyInteger: true,
    greaterThan: 0,
    message: "^"+"קוד מוסד מכיל ספרות בלבד"
  },
}};

export default function Register(props) {

  const location = useLocation();
  const [newUser, setNewUser] = useState(location.state != null ? { userName: location.state.userName, password: location.state.password } : {})
  const [state, setState] = useState({errors:{},touched:{},isValid:false});
  const navigate = useNavigate();
  const theme = createTheme();
  let dispatch = useDispatch();

  useEffect(()=>{
    const errors = validate(newUser,constraints);
    setState((prevState)=>({
      ...prevState,
      errors,
      isValid:!errors
    }))
  },[newUser])

  const handleChange = (e)=>{
    setNewUser({...newUser,[e.target.name]:e.target.value});
    setState((prevState)=>({...prevState,touched:{...prevState.touched,[e.target.name]:true}}));
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setState((prevState)=>({...prevState,submitted:true}));
    if(state.isValid){
    const result  = await fetch('http://localhost:4500/user/add',
      {
        method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        , body: JSON.stringify(newUser)
      }).then(response => response.json())
    if(!result?.errors){
        const user = result;
        dispatch(setUser(user));
        await dispatch(setUser(user))
        let plc = await fetchPlc(user);
        await dispatch(setPlc(plc[0]));
        await dispatch(setChannels([]))
        let groups = await fetchGroups(user)
        await dispatch(setGroups(groups))
        let alerts = await fetchActionAlert(user)
        await dispatch(setActioAlerts(alerts))
        navigate("/")
  }}
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
          }}
        >
          <Avatar sx={{ m: 1 }} style={{ backgroundColor: "blue" }} />
          <Typography component="h1" variant="h5">
            הרשמה
          </Typography>
        
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="userName"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="שם משתמש"
                  dir='rtl'
                  autoFocus
                  value={newUser.userName}
                  onChange={handleChange}
                />
                {(state.touched?.["userName"]||state.submitted)&&(<FormHelperText error>{state.errors?.["userName"]?.[0]}</FormHelperText>)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="סיסמא"
                  type="password"
                  id="password"
                  dir='rtl'
                  autoComplete="password"
                  value={newUser.password}
                  onChange={handleChange}
                />
                 {(state.touched?.["password"]||state.submitted)&&(<FormHelperText error>{state.errors?.["password"]?.[0]}</FormHelperText>)}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="כתובת מייל"
                  name="email"
                  dir='rtl'
                  autoComplete="email"
                  value={newUser.email}
                  onChange={handleChange}
                />
                {(state.touched?.["email"]||state.submitted)&&(<FormHelperText error>{state.errors?.["email"]?.[0]}</FormHelperText>)}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  label="כתובת"
                  name="address"
                  dir='rtl'
                  autoComplete="address"
                  value={newUser.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  label="טלפון"
                  name="phone"
                  dir='rtl'
                  autoComplete="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="institutionId"
                  label="קוד מוסד"
                  name="institutionId"
                  dir='rtl'
                  autoComplete="institutionId"
                  value={newUser.institutionId}
                  onChange={handleChange}
                />
                {(state.touched?.["institutionId"]||state.submitted)&&(<FormHelperText error>{state.errors?.["institutionId"]?.[0]}</FormHelperText>)}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "blue" }}
            >
              שמירה
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}