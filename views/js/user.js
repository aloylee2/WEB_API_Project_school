$(function() {
    $.ajax({
        url: "/users/"+sessionStorage.authToken,
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(user) {
                    $(".user").append(`
                    <article>
                        Username:<a href="/edituser?id=${user._id}">${user.username}</a><br>
                            Name:${user.name}<br>
                        Email:${user.emailaddress}<br>
                            Password: ${user.password}
                        </article>
                    `);
                })
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )
}) 
