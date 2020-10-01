import React from 'react'
import {Route, Switch} from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/SignUp';
import Signin from './auth/SignIn';
import Profile from './user/Profile';
import Menu from './core/Menu';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';

const MainRouter = () => {
       return( 
       <div>
         <Menu />
         <Switch>
           <Route exact path="/" component={Home} />
           <Route path="/users" component={Users}/>
           <Route path="/signup" component={Signup}/>
           <Route path="/signin" component={Signin}/>
           <Route path="/user/:userId" component={Profile}/>
           <PrivateRoute path="/user_edit/:userId" component={EditProfile} />
         </Switch>
       </div>
       ) 
      }

export default MainRouter