var userId = 0;
$(function() { // This is our so called “ready” function in shorthand
    var urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('id');

    $.ajax({
        url: "/users/" + userId,
        method: "get"
    }).done(
        function (data) {
            $('#name').val(data.name);
            $('#user').val(userId);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );
});

function payroll() {
    var newpayroll = {
        amount: $("#amount").val(),
        user: $("#user").val()
    };
    $.ajax({
        url:"/payrolls?token="+sessionStorage.authToken,
        method:"POST",
        data: newpayroll
    })
    .done(function(data){
        $(".statusMessage").text("Successfully paid");
        setTimeout(function(){
            location.reload();
        },3000);
    })
    .fail(function(err){
        $(".statusMessage").text("You are not a admin. Unable to pay teacher payroll.");
    })
    return false;
}

