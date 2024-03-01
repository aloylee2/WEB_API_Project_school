$(function() {
    $.ajax({
        url: "/modules",
        method: "get"
    })
        .done(
            function (data) {
                console.log(data);
                data.forEach(function(event) {
                    $(".Listmodules").append(`
                        <article>
                        <h2><a href="/attendanceform?modulename=${event.moduleName}">${event.moduleName}</a></h2>
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
})