const signin = async (user)=>{
    try{
        let response = await fetch('https://mern-social-app.herokuapp.com/api/signin' ,{
            method:'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type':'application/json'
            },
            body : JSON.stringify(user)
        })
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

const signout = async ()=>{
    try {
        let response = await fetch('https://mern-social-app.herokuapp.com/api/signout/' ,{
            method:'GET'
        })

        return response.json(); 
    } 
    catch (error) {
        console.log(error)
    }
}

export { signin , signout }