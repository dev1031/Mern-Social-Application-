const create = async (user)=>{
    try{
        let response = await fetch('https://mern-social-app.herokuapp.com/api/create_user/' ,{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type':'application/json'
            },
            body : JSON.stringify(user)
        })
        return await response.json();
    }
    catch(error){
        console.log(error)
    }
}

const list = async (signal)=>{
    try{
        let response = await fetch('https://mern-social-app.herokuapp.com/api/users',{
            method :'GET',
            signal : signal,
        })
        return await response.json();
    }
    catch(error){
        console.log(error)
    }
}

const read = async (params, credentials, signal) => {
    try {
      let response = await fetch('https://mern-social-app.herokuapp.com/api/get_user/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

const update = async (params , credentials , user)=>{
    try{
        let response = await fetch('https://mern-social-app.herokuapp.com/api/update_user/'+ params.userId ,{
            method:'PUT',
            headers : {
                'Accept' : 'application/json',
                'Authorization' : 'Bearer '+ credentials.t,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    }catch(error){
         console.log(error)
    }
}


const remove = async (params , credentials )=>{
    try {
        let response = await fetch('https://mern-social-app.herokuapp.com/api/delete_user/'+ params.userId ,{
            method:'DELETE',
            headers : {
                'Accept' : 'application/json',
                'Content-Type':'application/json',
                'Authorization' : 'Bearer '+ credentials.t
            }
        })
        return await response.json();
    } catch (error) {
     console.log(error)   
    }
}

const follow = async (params, credentials, followId) => {
    try {
      let response = await fetch('https://mern-social-app.herokuapp.com/api/users/follow/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, followId: followId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const unfollow = async (params, credentials, unfollowId) => {
    try {
      let response = await fetch('https://mern-social-app.herokuapp.com/api/users/unfollow/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId:params.userId, unfollowId: unfollowId})
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const findPeople = async (params, credentials, signal) => {
    try {
      let response = await fetch('https://mern-social-app.herokuapp.com/api/users/findpeople/' + params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })    
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

export  { create , list , read , update , remove , follow , unfollow, findPeople }