$(function() {
    $.ajax({
        url: "/ccas",
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(cca) {
                    $(".ccas").append(`
                        <article>
                        <h2><a href="/editcca?id=${cca._id}">${cca.ccaName}</a></h2>
                            Location:${cca.ccaLocation}<br>
                            Start:  ${cca.StartTime}<br>
                            End: ${cca.EndTime}<br>
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

    $(".addCca").click(function () {
        $(".addNewCca").show();
    })
})

function addCca() {
    var newcca = {
        ccaName: $("#ccaName").val(),
        ccaLocation: $("#ccaLocation").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val()
    };
    $.ajax({
        url:"/ccas?token="+sessionStorage.authToken,
        method:"POST",
        data: newcca
    })
    .done(function(data){
        $(".statusMessage").text(data.message);
        window.location.href = "/cca";
    })
    .fail(function(err){
        $(".statusMessage").text("You are not authorized to add cca");
    })

    return false;
}