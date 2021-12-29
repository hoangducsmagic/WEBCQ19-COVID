function checkPass(){
    if ($("#password").val().length < 6){ alert('Password quá ngắn');return false;}
    if ($("#password").val() != $("#confirmPassword").val()) { alert('password không khớp');return false;}
    return true;
}