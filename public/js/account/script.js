function checkPass(){
    if ($("#password").val().length < 6){ alert('Mật khẩu quá ngắn');return false;}
    if ($("#password").val() != $("#confirmPassword").val()) { alert('Mật khẩu không khớp');return false;}
    return true;
}

function checkNewPass(){
    if ($("#password").val().length < 6){ alert('Mật khẩu quá ngắn');return false;}
    if ($("#password").val() != $("#confirmPassword").val()) { alert('Mật khẩu không khớp');return false;}
    if ($("#password").val() === $("#username").val()) { alert('Mật khẩu không được phép trùng với tên đăng nhập');return false;}
    return true;
}