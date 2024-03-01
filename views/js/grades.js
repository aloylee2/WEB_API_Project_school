var totalcredithour = 0;
var credit = 0;
var gpapoint = 0.0;
var gpa = 0.0;
$(function(){
    $.ajax({
        url: '/grades',
        method: 'GET'
    })
    .done(
        function (data) {
            data.forEach(function(grade){
                credit = grade.module.credit;
                totalcredithour = totalcredithour + credit;
                
                if (grade.grade == "A") {
                    gpapoint = gpapoint + (4.0 * credit);
                } if (grade.grade == "B") {
                    gpapoint = gpapoint + (3.0 * credit);
                } if (grade.grade == "C") {
                    gpapoint = gpapoint + (2.0 * credit);
                } if (grade.grade == "D") {
                    gpapoint = gpapoint + (1.0 * credit);
                } if (grade.grade == "F") {
                    gpapoint = gpapoint + (0.0 * credit);
                }
                
                $(".viewGrades > tbody:last-child").append(`
                <tr>
                    <td>${grade.courseuser.user.name}</td>
                    <td>${grade.module.moduleName}</td>
                    <td>${grade.grade}</td>
                    <td>${grade.module.credit}</td>
                </tr>
                `); 
            });
            gpa = gpapoint / totalcredithour;
            gpa = parseFloat(gpa).toFixed(2);
            $(".viewGrades > tbody:last-child").after(`
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${gpa}</td>
                </tr>
            `);

        }
    )
    .fail(
        function (err) {
            console.log(err.responseText);
        }
    )
})

