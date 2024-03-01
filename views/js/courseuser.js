$(function() {
    $.ajax({
        url: "/courseuser",
        method: "get"
    })
        .done(
            function (data) {
                console.log(data);
                data.forEach(function(event) {
                    $(".events").append(`
                        <article>
                        <h2><a href="/edit?id=${event._id}">${event.courseName}</a></h2>
                        <div>
                            ${event.courseName}<br>
                           
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
            $(".addcourseuser").show();
            $.ajax(
                {
                    url: '/courses',
                    method: 'get'
                }
            ).done(function (data) {
                console.log(data);
                data.forEach(function (courses) {
                    $("#name").append(`<option value='${courses.courseName}'>${courses.courseName}</option>`);
                })
            }).fail(function (err) {
                console.log(err.responseText);
            });
        })
})

function addcourseuser() {
    var newCourseuser = {
        courseName: $("#name").val(),
        courseID: $("#id").val()
    };
    $.ajax({
        url:"/courseuser?token="+sessionStorage.authToken,
        method:"POST",
        data: newCourseuser
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
