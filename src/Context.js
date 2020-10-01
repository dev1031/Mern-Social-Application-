import React from 'react';

const UserApiContext = React.createContext(); 

class UserApiProvider extends React.Component{
    constructor(){
        super();
        this.state ={
            value :[],
            posts : []    
        }
    }
    componentDidMount(){
        try{
             fetch('https://mern-social-app.herokuapp.com/api/users',{
                method :'GET'
            })
            .then((res)=>res.json())
            .then((res)=>{
                this.setState({
                    value : res
                })
            });

            fetch('https://mern-social-app.herokuapp.com/api/posts',{
                method:'GET'
            })
            .then((res)=>res.json())
            .then((res)=>{
                this.setState({
                    posts: res
                })
            })
        }
        catch(error){
            console.log(error)
        }
    }
    render(){
        return (
            <UserApiContext.Provider value ={{value : this.state.value , posts : this.state.posts}}>
                { this.props.children }
            </UserApiContext.Provider>
        )
    }
}

const UserApiConsumer =  UserApiContext.Consumer;

export { UserApiProvider , UserApiConsumer };
