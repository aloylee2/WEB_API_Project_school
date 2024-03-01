$(function() {
    $.ajax({
        url: "/bookings",
        method: "get"
    })
        .done(
            function (data) {
                data.forEach(function(booking) {
                    $(".booking").append(`
                        <article>
                        <h2><a href="/editbooking?id=${booking._id}">${booking.facility}</a></h2>
                        <div>
                            ${booking.student}<br>
                            ${booking.facility}<br>
                            Start: ${booking.start.date} ${booking.start.time}<br>
                            End: ${booking.end.date} ${booking.end.time}<br>
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

    $(".bookingnew").click(function () {
        $(".addNewBooking").show();
        $.ajax(
            {
                url: '/facilities',
                method: 'get'
            }
        ).done(function (data) {
            data.forEach(function (facilities) {
                $("#facilities").append(`<option value='${facilities.facility}'>${facilities.facility}</option>`);
            })
        }).fail(function (err) {
            console.log(err.responseText);
        });
    })
})