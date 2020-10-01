import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-healper';
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function EditProfile({ match }) {
  const classes = useStyles();
  const [image, setImage] = useState('');
  const [ name , setName] = useState('');
  const [ password , setPassword] = useState('');
  const [ email , setEmail] = useState('');
  const [ error , setError] = useState('');
  const [ redirectToProfile , setRedirectToProfile] = useState(false);
  const [ about , setAbout] = useState('');
  const [ photo , setPhoto] = useState('');
  const [userId , setUserId]= useState('');

  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      setName(data.name);
      setUserId(data._id);
      setEmail(data.email);
      setPassword('');
      setPhoto(data.photo);
      setAbout(data.about);
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId , photo])

  const clickSubmit =  async () => {  
    const fd = new FormData();
    fd.append('file' , image);
    fd.append('upload_preset' , 'social-media');
    fd.append("cloud_name", "dnqawabn9");
    let res =  await fetch('https://api.cloudinary.com/v1_1/dnqawabn9/image/upload' ,{ 
      method:"POST",
      body: fd
    })
    let response = await res.json();
    let url = await response.url
      const user = {
        name:name,
        email:email,
        password:password,
        photo:url,
        about:about,
      };
  
    await update({
        userId: match.params.userId
      }, {t: jwt.token }, user).then((data) => {
        if(data.error){
          setError(data.error)
        }
        setRedirectToProfile(true)
      })
  }

    if (redirectToProfile) {
      return (<Redirect to={'/user/' + userId}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Edit Profile
          </Typography>
          <Avatar src= {photo} className={classes.bigAvatar}/><br/>
          <input  className={classes.input} id="icon-button-file" type="file" onChange={(e)=>setImage(e.target.files[0])} />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="default" component="span">
              Upload
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{photo ? photo.name : ''}</span><br/>
          <TextField id="name" label="Name" className={classes.textField} value={name} onChange={(e)=>setName(e.target.value)} margin="normal"/><br/>
          <TextField id="multiline-flexible" label="About" multiline rows="2" value={about} onChange={(e)=>setAbout(e.target.value)}  className={classes.textField} margin="normal" /><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} onChange={(e)=>setEmail(e.target.value)} value={email}  margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={password} onChange={(e)=>setPassword(e.target.value)}   margin="normal"/><br/> 
          {
            error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}