$(function() {
    var token = sessionStorage.authToken;

    if(token == undefined) {
        $(".protectedSection").hide();
        $(".unprotectedSection").show();
    } else {
        $(".protectedSection").show();
        $(".unprotectedSection").hide();
    }

   
});
