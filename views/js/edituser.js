var userId = 0;
$(function() { // This is our so called “ready” function in shorthand
    var urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('id');
    console.log(userId);

    $.ajax({
        url: "/user/" + userId,
        method: "get"
    }).done(
        function (data) {
            console.log(data);
            $('#UserName').val(data.username);
            $('#Password').val(data.password);
            $('#Email').val(data.emailaddress);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );


});

function editUser() {
    var user = {
        id: userId,
        username: $("#UserName").val(),
        password: $("#Password").val(),
        emailaddress: $("#Email").val(),
    };
    $.ajax(
        {
            url: '/users',
            method: 'put',
            data: user
        }
    ).done(
        function (data) {
            alert("User updated!");
            window.location.href = "/user";
        }
    ).fail(
        function (err) {
           console.log(err.responseText);
        }
    );
    return false;
}
