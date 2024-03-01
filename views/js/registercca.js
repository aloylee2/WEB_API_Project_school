$(function() {
    $.ajax({
        url: "/registerccas",
        method: "get"
    })
        .done(
            function (data) {
                console.log(data);
                data.forEach(function(cca) {
                    $(".ccas").append(`
                        <article>
                        <div>
                            ${cca.ccaName}<br>
                           
                        </div>
                        </article>
                    `);
                });
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )

  
        $(".booking").click(function () {
            $(".addNewbooking").show();
            $.ajax(
                {
                    url: '/ccas',
                    method: 'get'
                }
            ).done(function (data) {
                console.log(data);
                data.forEach(function (ccas) {
                    $("#name").append(`<option value='${ccas.ccaName}'>${ccas.ccaName}</option>`);
                })
            }).fail(function (err) {
                console.log(err.responseText);
            });
        })
})

function addstudentcca() {
    var newStudentscca = {
        ccaName: $("#name").val()
    };
    $.ajax({
        url:"/registerccas?token="+sessionStorage.authToken,
        method:"POST",
        data: newStudentscca
    })
    .done(function(data){
        $(".statusMessage").text(data);
        setTimeout(function(){
            location.reload();
        },3000);
    })
    .fail(function(err){
        $(".statusMessage").text("Unable to add new event");
    })
    return false;
}
