$(function() {
    $.ajax({
        url: "/payrolls",
        method: "get"
    })
        .done(
            function (data) {
                console.log(data);
                data.forEach(function(user) {
                    $("table").append(`
                    <tr>

                    <td>${user.user.name}</td>
                    <td>${user.user._id}</td>
                    <td>${user.user.emailaddress}</td>
                    <td>${user.user.role}</td>
                    <td>${user.amount}</td>
                    </tr>
                    `);
                });
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        ) 
})