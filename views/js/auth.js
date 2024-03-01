$(function() {

    var token = sessionStorage.authToken;

    if(token == undefined) {
        $("#logout").hide();
        $(".login").show();

        //course & module
        $(".addCourse").hide();
        $("button").hide();
        $("#courseName").hide();
        $("#courseDesc").hide();
        $("label[for=courseName]").hide();
        $("label[for=courseDesc]").hide();
        $(".EditCourse").hide();

        //cca
        $(".addCca").hide();
        $("#ccaName").hide();


        //booking
        $(".bookingLink").hide();

         //timetable
         $(".timetableLink").hide();

         //attendance
         $(".attendanceLink").hide();

         //Profile
         $(".ProfileLink").hide();

         //Register Course
         $(".RegCourseLink").hide();

         //Register CCA
         $(".RegCCALink").hide();

         //Pay School fee
         $(".paySchoolLink").hide();

         //Pay roll
         $(".payrollLink").hide();

         //Grades
         $(".GradeLink").hide();

        
    } else {
        $("#logout").show();
        $(".login").hide();

        //course & module
        $(".addCourse").show();
        $("button").show();
        $("#courseName").show();
        $("#courseDesc").show();
        $("label[for=courseName]").show();
        $("label[for=courseDesc]").show();

        //cca
        $(".addCca").show();
        $("#ccaName").show();
        
        //booking
        $(".bookingLink").show();

         //timetable
         $(".timetableLink").show();

         //attendance
         $(".attendanceLink").show();

         //Profile
         $(".ProfileLink").show();

         //Register Course
         $(".RegCourseLink").show();

         //Register CCA
         $(".RegCCALink").show();

         //Pay School fee
         $(".paySchoolLink").show();

         //Pay roll
         $(".payrollLink").show();
         
         //Grades
         $(".GradeLink").show();
    }


    // handles the clicking of the logout function
    $(".logoutLink").click(function(e){
        //prevents the browser from navigating to "#", as defined by the <a href> tag
        e.preventDefault();
        
        $.ajax({
            url: "/logout?token="+sessionStorage.authToken,
            method:"get"
        })
        .done(function(data){
            sessionStorage.removeItem("authToken");
            //go to homepage
            window.location.href="/";
        })
        .fail(function(err){
            console.log(err.responseText);
        })
    })
});

function login() {
    var credentials = {
        username: $("#username").val(),
        password: $("#password").val()
    }
    $.ajax({
        url:"/login",
        method:"post",
        data:credentials
    })
    .done(function(data){
        $(".statusMessage").text(data.message);
        sessionStorage.authToken=data.token;
        window.location.href = "/";
    })
    .fail(function(err){
        $(".statusMessage").text(err.responseText);
    })
    return false;
}
