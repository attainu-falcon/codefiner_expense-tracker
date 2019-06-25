
document.getElementById('sbt-btn').addEventListener('click', function(){
    validatingTheInputs ()
})

function validatingTheInputs () {
    var name = document.querySelector('#name').value;
    var username = document.querySelector('#username').value;
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var cpassword = document.querySelector('#cpassword').value;

    if(username.length<6) {
        alert('Username Cannot be less than 6 characters');
        return false
    }
    else if(password.length<8){
        alert('Password cannot be less than 8 characters');
        return false;
    }
    else if(!charCode(username)) {
        alert('Invalid Characters');
        return false;
    }
    else if(!isNaN(parseFloat(user[0]))){
        alert('Username cannot start with a digit');
        return false;
    }
    else if(password !== cpassword|| password !== pass) {
        alert('Wrong inputs');
        return false;
    }
    else{
        alert('LogIn Successful');
        return true;
    }
}

function charCode(string) {
    var i, code;
    for(i=0; i<string.length; i++)  {
        code = string.charCodeAt(i);

    if(!(code>47 && code<58) &&
       !(code>64 && code<91) &&
       !(code>96 && code<123) &&
       !(code == 95) ) {
           return false;
       }
    }
    return true;
}