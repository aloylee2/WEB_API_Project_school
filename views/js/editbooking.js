var bookingId = 0;
$(function() { // This is our so called “ready” function in shorthand
    var urlParams = new URLSearchParams(window.location.search);
    bookingId = urlParams.get('id');
    

    $.ajax({
        url: "/bookings/" + bookingId,
        method: "get"
    }).done(
        function (data) {
            $('#student').val(data.student);
            $('#facilities').val(data.facility);
            $('#startDate').val(data.start.date);
            $('#startTime').val(data.start.time);
            $('#endDate').val(data.end.date);
            $('#endTime').val(data.end.time);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );


});

function editBooking() {
    var event = {
        id: bookingId,
        student: $("#student").val(),
        facility: $("#facilities").val(),
        startDate: $("#startDate").val(),
        startTime: $("#startTime").val(),
        endDate: $("#endDate").val(),
        endTime: $("#endTime").val()
    };
    $.ajax(
        {
            url: '/bookings',
            method: 'put',
            data: event
        }
    ).done(
        function (data) {
            alert("Booking updated!");
        }
    ).fail(
        function (err) {
           console.log(err.responseText);
        }
    );
    return false;
}

$(".deleteEventBtn").on('click', function() {
    $.ajax(
        {
            url: '/bookings/'+bookingId,
            method: 'delete'
        }
    ).done(
        function (data) {
            alert("Booking deleted!");
            window.location.href = "/booking";
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );
});


