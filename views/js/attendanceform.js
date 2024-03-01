var modulename = "";
$(function() {
    var urlParams = new URLSearchParams(window.location.search);
    modulename = urlParams.get('modulename');
    $.ajax({
        url: "/studentmodules/"+modulename,
        method: "get"
    })
        .done(
            function (data) {
                console.log(data);
                var count = 0
                data.forEach(function(event) {
                    count = count+1
                    $(".rows").append(`
                    
                    <tr>
                    <form>
                        <td>
                        <input type="text" id="${count}" name="name_count" value="${event.courseuser.user.name}" readonly>
                        </td>
                        <td>
                        <select name="attendance" id="attendance_${count}">
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                        </td>
                        <td><input type="button" class="attendancebutton" value="Submit" onclick="postattendance(${count})"></td>
                        </form>
                    <tr>
                   
                    `);
                });
            }
        )
        .fail(
            function (err) {
                console.log(err.responseText);
            }
        )
})
function postattendance(count) {
    var urlParams = new URLSearchParams(window.location.search);
    modulename = urlParams.get('modulename');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var newAttendance = {
        date: date,
        name: $("#"+count).val(),
        module:modulename,
        attendance: $("#attendance_"+count).val()
    };
    $.ajax({
        url:'/submitattendance'+'?token='+sessionStorage.authToken,
        method:"POST",
        data: newAttendance
    })
    .done(function(data){
        $(".statusMessage").append(`
        <p>${data}<p>
        `);
        
    })
    .fail(function(err){
        $(".statusMessage").text("You are unable to mark attendance");
        console.log(err)
    })
    return false;
}
