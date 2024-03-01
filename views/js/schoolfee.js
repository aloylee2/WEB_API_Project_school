function schoolfees() {
    var newschoolfee = {
        amount: $("#amount").val(),
    };
    $.ajax({
        url:"/schoolfees?token="+sessionStorage.authToken,
        method:"POST",
        data: newschoolfee
    })
    .done(function(data){
        $(".statusMessage").text("FINALLY PAID SCHOOL FEES");
        setTimeout(function(){
            location.reload();
        },3000);
    })
    .fail(function(err){
        $(".statusMessage").text("You are not a student. Unable to pay school fee.");
    })
    return false;
}
