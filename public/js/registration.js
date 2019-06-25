document.getElementById('sbt-btn').addEventListener('click', function(){
    var password = document.getElementById('password').value;
    var cpassword = document.getElementById('cpassword').value;
  
    if(password != cpassword) {
       alert('passwords do not match. Please type again.')
       return false;
    }else {
        return true;
    }
})