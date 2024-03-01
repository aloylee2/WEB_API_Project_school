$(function() {
    $.ajax({
        url: "/users/role/teacher",
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(user) {
                    $(".teacher").append(`
                    <tr>

                    <td><a href="/editpayroll?id=${user._id}">${user.name}</a></td>
                    <td>${user._id}</td>
                    <td>${user.emailaddress}</td>
                    <td>${user.role}</td>
                    </tr>
                    `);
                })
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )

        $.ajax({
            url: "/payrolls",
            method: "get"
        })
            .done(
                function (data) {
                    data.forEach(function(user) {
                        $(".amount").append(`
                        <tr>
    
                        <td>${user.user.name}</td>

                        <td>${user.amount}</td>
                      
                        </tr>
                        `);
                    })
                }
            )
            .fail(
                function (err) {
                    console.log(err.responseText);
                }
            )
            $.ajax({
                url: "/schoolfees",
                method: "get"
            })
                .done(
                    function (data) {
                        data.forEach(function(user) {
                            $(".fee").append(`
                            <tr>
        
                            <td>${user.user.name}</td>
    
                            <td>${user.amount}</td>
                          
                            </tr>
                            `);
                        })
                    }
                )
                .fail(
                    function (err) {
                        console.log(err.responseText);
                    }
                );
         
})
