var courseId = 0;
$(function() {
    var urlParams = new URLSearchParams(window.location.search);
    courseId = urlParams.get('id');

    $.ajax({
        url: "/courses/" + courseId,
        method: "get"
    }).done(
        function (data) {
            console.log(data)
            $('#courseName').val(data[0].courseName);
            $('#courseDesc').val(data[0].courseDesc);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );

    /**** DELETE FUNCTION HERE */
    $(".deleteCourseBtn").on('click', function() {
        $.ajax(
            {
                url: '/courses/' + courseId + '?token=' + sessionStorage.authToken,
                method: 'delete'
            }
        ).done(
            function (data) {
                alert(data.message);
                window.location.href = "/course";
            }
        ).fail(
            function (err) {
                console.log(err.responseText);
                $(".statusMessage2").text("You are not authorized to Delete Course");
            }
        );
    });
});

function editCourse() {
    var course = {
        id: courseId,
        courseName: $("#courseName").val(),
        courseDesc: $("#courseDesc").val(),
    };
    $.ajax(
        {
            url: '/courses?token='+sessionStorage.authToken,
            method: 'PUT',
            data: course
        }
    ).done(
        function (data) {
            alert(data.message);
            window.location.href = "/course";
            
        }
    ).fail(
        function (err) {
            console.log(err);
           $(".statusMessage2").text("You are not authorized to Edit Course");
        }
    );
    return false;
}

