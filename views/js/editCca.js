var ccaId = 0;
$(function() { // This is our so called “ready” function in shorthand
    var urlParams = new URLSearchParams(window.location.search);
    ccaId = urlParams.get('id');

    $.ajax({
        url: "/ccas/" + ccaId,
        method: "get"
    }).done(
        function (data) {
            $('#ccaName').val(data.ccaName);
            $('#ccaLocation').val(data.ccaLocation);
            $('#StartTime').val(data.StartTime);
            $('#EndTime').val(data.EndTime);
        }
    ).fail(
        function (err) {
            console.log(err.responseText);
        }
    );

    $(".deleteCcaBtn").on('click', function() {
        $.ajax(
            {
                url: '/ccas/'+ ccaId + '?token=' + sessionStorage.authToken,
                method: 'delete'
            }
        ).done(
            function (data) {
                alert("Cca deleted!");
                window.location.href = "/cca";
            }
        ).fail(
            function (err) {
                console.log(err.responseText);
                $(".statusMessage").text("You are not authorized to Delete Cca");
            }
        );
});


});

function editCca() {
    var cca = {
        id: ccaId,
        ccaName: $("#ccaName").val(),
        ccaLocation: $("#ccaLocation").val(),
        StartTime: $("#StartTime").val(),
        EndTime: $("#EndTime").val()
    };
    $.ajax(
        {
            url:"/ccas?token="+sessionStorage.authToken,
            method: 'put',
            data: cca
        }
    ).done(
        function (data) {
            alert("Cca updated!");
            window.location.href = "/cca";
        }
    ).fail(
        function (err) {
           console.log(err.responseText);
           $(".statusMessage").text("You are not authorized to Edit Cca");
        }
    );
    return false;
}

