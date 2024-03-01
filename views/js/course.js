$(function() {
    $.ajax({
        url: "/courses",
        method: "GET"
    })
        .done(
            function (data) {
                console.log(data);
                data.forEach(function(course) {
                    $(".courses").append(`
                        <article>
                        <h2><a href="/editcourse?id=${course._id}">${course.courseName}</a></h2>
                        <h1>${course.courseDesc}</h2>
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

    $(".addCourse").click(function () {
        $(".addNewCourse").show();
    })
  
})

function addCourse() {
    var newCourse = {
        courseName: $("#courseName").val(),
        courseDesc: $("#courseDesc").val(),
        courseID: $("#courseID").val()
    };
    $.ajax({
        url:"/courses?token="+sessionStorage.authToken,
        method:"POST",
        data: newCourse
    })
    .done(function(data){
        $(".statusMessage").text(data.message);
        window.location.href = "/course";
    })
    .fail(function(err){
        $(".statusMessage").text("You are not authorized to add Course");
    })

    return false;
}