$(function() {
    var urlParams = new URLSearchParams(window.location.search);
    let courseId = urlParams.get('id')
    $.ajax({
        url: "/modules/" + courseId,
        method: "get"
    })
        .done(
            function (data) {
                console.log(data)
                data.forEach(function(module) {
                    $(".modules").append(`
                        <article>
                        <h2>${module.moduleName}</h2>
                        <h1>${module.moduleDesc}</h2>
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

        $(".deleteModuleBtn").on('click', function() {
            $.ajax(
                {
                    url: '/modules/' + courseId + '?token=' + sessionStorage.authToken,
                    method: 'delete'
                }
            )
            .done(
                function(data) {
                    $(".statusMessage").text(data.message);
                    window.location.href = "/editcourse?id=" + courseId;
                }
            )
            .fail(
                function(err) {
                    $(".statusMessage").text("You are not authorized to Delete Module");
                }
            )
        })


    $(".addModule").click(function () {
        $(".addNewModule").show();
    })
})

function addModule() {
    var newModule = {
        moduleName: $("#moduleName").val(),
        moduleDesc: $("#moduleDesc").val(),
        credit: $("#credit").val(),
        hour: $("#hour").val(),
        course: $("#course").val()
    };
    $.ajax({
        url:"/modules?token=" + sessionStorage.authToken,
        method:"POST",
        data: newModule
    })
    .done(function(data){
        $(".statusMessage").text(data.message);
        window.location.href = "/editcourse?id=" + courseId;
    })
    .fail(function(err){
        $(".statusMessage").text("You are not authorized to Add Module");
    })

    return false;
}