$(function() {
    $.ajax({
        url: "/timetables",
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(timetable) {
                    $(".timetable").append(`
                        <article>
                        <h2>${timetable.module}</h2>
                        <div>
                            ${timetable.venue}<br>
                            ${timetable.day}<br>
                            Start: ${timetable.startTime}<br>
                            End: ${timetable.endTime}<br>
                        </div>
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

    $(".newtimetable").click(function () {
        $(".addNewtimetable").show();
        $.ajax(
            {
                url: '/modules',
                method: 'get'
            }
        ).done(function (data) {
            data.forEach(function (module) {
                $("#moduletimetable").append(`<option value='${module.moduleName}'>${module.moduleName}</option>`);
            })
        }).fail(function (err) {
            console.log(err.responseText);
        });
    })
})
function addtimetable(){
    var newtimetable = {
        day: $("#day").val(),
        venue:$("#venue").val(),
        module:$("#moduletimetable").val(),
        startTime: $("#startTime").val(),
        endTime:$("#startTime").val()
    };
    $.ajax({
        url:'/timetables'+'?token='+sessionStorage.authToken,
        method:"POST",
        data: newtimetable
    })
    .done(function(data){
        $(".statusMessage").text(data);
        setTimeout(function(){
            location.reload();
        },3000);
        
    })
    .fail(function(err){
        $(".statusMessage").text("You are unable to add timetable");
    })
    return false;
}