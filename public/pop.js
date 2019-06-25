function openForm() {
    document.getElementById('myForm').style.display="block";
};

function closeForm() {
    document.getElementById('myForm').style.display="none";
}
var name = document.getElementById('name').value;
var email = document.getElementById('email').value;
var username = document.getElementById('username').value;
var psd = document.getElementById('psd').value;
var psd2 = document.getElementById('psd2').value;

document.getElementById('subt').addEventListener('click', function(){
  if(!name){
    alert('The name field is empty.');
    return false;
  }else if(!email){
    alert('The email field is empty.');
    return false;
  }else if(!username){
    alert('The username field is empty.');
    return false;
  }else if(!psd){
    alert('The password field is empty.');
    return false;
  }else if(psd != psd2){
    alert('Passwords doesnot match.')
    return false;
  }else{
  return true;
  }
});