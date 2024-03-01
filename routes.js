var express = require('express');
var mongoose = require('mongoose');
var db = require('./services/dataservice.js');
var crypto = require('crypto');
const e = require('express');
db.connect();

var router = require('express').Router();

router.use(express.urlencoded({
    extended: true
}));

router.use(function (req, res, next) {
    //only check for token if it is PUT, DELETE methods or it is POSTING to events
    if (req.method == "POST"&& req.url.includes("/courseuser")
    ||(req.method == "GET"&& req.url.includes("/logout"))
    ||(req.method == "POST"&& req.url.includes("/schoolfees"))
    ||(req.method == "POST" && req.url.includes("/courses"))
    ||(req.method == "PUT" && req.url.includes("/courses"))
    ||(req.method == "DELETE" && req.url.includes("/courses"))
    ||(req.method == "POST" && req.url.includes("/modules"))
    ||(req.method == "DELETE" && req.url.includes("/modules"))
    ||(req.method == "POST" && req.url.includes("/submitattendance"))
    ||(req.method == "POST" && req.url.includes("/timetables"))
    ||(req.method == "POST" && req.url.includes("/ccas"))
    ||(req.method == "PUT" && req.url.includes("/ccas"))
    ||(req.method == "DELETE" && req.url.includes("/ccas"))
    ||(req.method == "POST" && req.url.includes("/registerccas"))
    ||(req.method == "POST" && req.url.includes("/payrolls"))
     ) {
        var token = req.query.token;
        if (token == undefined) {
            res.status(401).send("No tokens are provided. You are not allowed to perform this action.");
        } else {
            db.checkToken(token, function (err, user) {
                if (err || user == null) {
                    res.status(401).send("[Invalid token] You are not allowed to perform this action.");
                } else {
                    console.log(user);
                    //set a local variable to be used for the next route
                    res.locals.user = user;

                    //means proceed on with the request.
                    next();
                }
            });
        }
    } else {
        next();
    }
});


router.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

router.get('/course', function (req, res) {
    res.sendFile(__dirname + "/views/course.html")
});

router.get('/loginpage', function (req, res) {
    res.sendFile(__dirname + "/views/login.html")
});

router.get('/viewregisterccas', function (req, res) {
    res.sendFile(__dirname + "/views/registercca.html")
});
router.get('/viewcourseuser', function (req, res) {
    res.sendFile(__dirname + "/views/courseuser.html")
});

router.get('/editcourse', function (req, res) {
    res.sendFile(__dirname + "/views/courseDetail.html");
});

router.get('/viewgrades', function(req, res){
    res.sendFile(__dirname + "/views/grades.html");
});

router.get('/viewpayrolllist', function(req, res){
    res.sendFile(__dirname + "/views/payroll.html");
});
router.get('/allpayroll', function(req, res){
    res.sendFile(__dirname + "/views/allpayroll.html");
});

router.get('/editpayroll', function (req, res) {
    res.sendFile(__dirname + "/views/editPayroll.html");
});

router.get('/payschoolfee', function (req, res) {
    res.sendFile(__dirname + "/views/schoolfees.html");
});

router.get('/js/*', function (req, res) {
    res.sendFile(__dirname + "/views/" + req.originalUrl);
});

router.get('/css/*', function (req, res) {
    res.sendFile(__dirname + "/views/" + req.originalUrl);
});

//Course routing start//
//get all courses
router.get('/courses', function (req, res) {
    db.getAllCourses(function (err, courses) {
        if (err) {
            res.status(500).send("Unable to get All Courses.");
        } else {
            res.send(courses);
        }
        
    })
});

//get course by id
router.get('/courses/:id', function (req, res) {
    var id = req.params.id;
    db.getCourse(id, function (err, course) {
        if (err) {
            res.status(500).send("Unable to get Course of this ID");
        } else {
            res.status(200).send(course);
        }
    })
});

//add a course
router.post('/courses', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    if (role != "teacher"){
            res.status(401).send("You are not authorized to add Courses");
        } else {
            db.addCourse(data.courseName, data.courseDesc, data.courseID,
                function (err, course) {
                    if (err) {
                        res.status(500).send("Unable to Add Course");
                    } else {
                        res.status(200).json({ 'message': 'Course Added Successfully'});
                    }
                })
        }  
});

//update course
router.put('/courses', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    if (role != "teacher"){
        res.status(401).send("You are not authorized to edit Course")
    } else {
        db.updateCourse(data.id, data.courseName, data.courseDesc,
            function (err, course) {
                if (err) {
                    res.status(500).send("Unable to update Course");
                } else {
                    res.status(200).json({'message' : 'Course Edited Successfully'});
                }
            })
    }
    
});

//delete course
router.delete('/courses/:id', function (req, res) {
    var id = req.params.id;
    var role = res.locals.user.role;
    if (role != "teacher"){
        res.status(401).send("You are not authorized to delete Course");
    } else {
        db.deleteCourse(id, function (err, course) {
            if (err) {
                res.status(500).send("Unable to delete course");
            } else {
                res.status(200).json({'message' : 'Course Deleted Successfully'});
            }
        });
    } 
});
//Course routing end//

//Module routing start//
//get module by courseID
router.get('/modules/:id', function (req, res) {
    var id = req.params.id;
    db.getModuleByCourseID(id, function (err, module) {
        if (err) {
            res.status(500).send("Unable to get Module of this Course ID");
        } else {
            res.status(200).send(module);
        }
    });

});

//delete a module
router.delete('/modules/:id', function (req, res){
    var id = req.params.id;
    var role = res.locals.user.role;
    if (role != "teacher"){
        res.status(401).send("You are not authorized to Delete Module");
    } else {
        db.deleteModule(id, function (err, module){
            if (err || module == null) {
                res.status(500).send("Unable to delete Module.");
            } else {
                res.status(200).json({'message' : 'Module Deleted Successfully'});
            }
        })
    }
    
})

//add a module
router.post('/modules', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    var courseid = mongoose.Types.ObjectId(data.course);
    if (role != "teacher"){
        res.status(401).send("You are not authorized to Add Module");
    } else {
        db.addModule(data.moduleName, data.moduleDesc, data.credit, data.hour, courseid,
            function (err, module) {
                if (err) {
                    res.status(500).send("Unable to add Module");
                } else {
                    res.status(200).json({'message' : 'Module Added Successfully'});
                }
            })
    }
});
//Module routing end//

//cca index page
router.get('/cca', function (req, res) {
    res.sendFile(__dirname + "/views/cca.html");
});

//===============Start of booking facilities=======================//

//booking page
router.get('/booking', function (req, res) {
    res.sendFile(__dirname + "/views/booking.html");
});

//book facilities
router.post('/bookings', function (req, res) {
    var data = req.body;
    db.bookfacility(data.student, data.facilities, data.startDate, data.startTime, data.endDate, data.endTime,
        function (err, booking) {
            if(err){
                res.status(500).send('Unable to add booking')
            }else{
            res.redirect('back');
            }
        })
    });
    
//get all booking
router.get('/bookings', function (req, res) {
    db.getAllBookings(function (err, booking) {
        if(err){
            res.status(500).send("Unable to find booking ");
        }else{
            res.status(200).send(booking)
        }
    })
});

//get booking by id
router.get('/bookings/:id', function (req, res) {
    var id = req.params.id;
    db.getbooking(id, function (err, booking) {
        if(err){
            res.status(500).send("Unable to find booking ");
        }else{
            res.status(200).send(booking)
        }
    })

});

//delete booking
router.delete('/bookings/:id', function (req, res) {
    var id = req.params.id;
    db.deletebooking(id, function (err, event) {
        if(err){
            res.status(500).send("Unable to delete booking ");
        }else{
            res.status(200).send("Delete succesful")
        }
    });
});

//edit booking
router.put('/bookings', function (req, res) {
    var data = req.body;
    db.updatebooking(data.id, data.student, data.facilities, data.startDate, data.startTime, data.endDate, data.endTime,
        function (err, bookingSchema) {
            if(err){
                res.status(500).send("Unable to update booking ");
            }else{
                res.status(200).send("booking updated")
            }
        });
})

//edit page
router.get('/editbooking', function (req, res) {
    res.sendFile(__dirname + "/views/editbooking.html");
});

//get facilties as a selection
router.get("/facilities", function (req, res) {
    db.getfacilities(function (err, facilities) {
        if(err){
            res.status(500).send("Unable to find facilities");
        }else{
            res.status(200).send(facilities)
        }
    })
})

//===============End of facilities=========================//

//=========================start of user===========================
//teacher page
router.get('/user', function (req, res) {
    res.sendFile(__dirname + "/views/user.html");
});

//get all teacher
router.get('/users', function (req, res) {
    db.getAllUser(function (err, users) {
        if (err) {
            res.status(500).send("Unable to find all user ");
        } else {
            res.status(200).send(users);
        }
    });
});
 //get one teacher using id
 router.get('/users/:token', function (req, res) {
    var token = req.params.token;
    db.getUserbytoken(token, function (err, user) {
        if (err) {
            res.status(500).send("Unable to find a user with this id");
        } else {
            res.status(200).send(user);
        }
    })
})
router.get('/user/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.params);
    db.getUserbyid(id, function (err, u) {
        if (err) {
            res.status(500).send("Unable to find a user with this id");
        } else {
            res.status(200).send(u);
        }
    })
})
 //create teacher
router.post('/users', function (req, res) {
    var data = req.body;
    //same as the name in the html under form action
    db.addUser(data.username, data.password, data.emailaddress,
        //this is the callback
        //adding 1 event
        function (err, user) {
            if (err) {
                res.status(500).send("Unable to add a new user");
            } else {
                res.status(200).send(user);
            }
        })
});

router.get('/edituser', function (req, res) {
    res.sendFile(__dirname + "/views/edituser.html");
});

//update user
router.put('/users', function (req, res) {
    var data = req.body;
    db.updateuser(data.id, data.username, data.password,  data.emailaddress,
        function (err, user) {
            if (err) {
                res.status(500).send("Unable to update the user");
            } else {
                res.status(200).send(user);
            }
        });
});


router.put('/users/:token', function (req, res) {
    var data = req.body;
    var id = req.params.token;
    db.updateuser(id, data.username, data.password, data.name, data.emailaddress, data.role,
        function (err, user) {
            if (err) {
                res.status(500).send("Unable to update the user");
            } else {
                res.status(200).send(user);
            }
        });
});


//delete teacher
router.delete('/users/:id', function (req, res) {
    var id = req.params.id;
    db.deleteUser(id, function (err, user){
        if (err) {
            res.status(500).send("Unable to deleted the user");
        } else {
            res.status(200).send("User have been deleted");
        }
    });
})
//=========================end of user===========================
//=========================start of cca===========================
//get all cca
router.get('/ccas', function (req, res) {
    db.getAllCcas(function (err, ccas) {
        if (err) {
            res.status(500).send("Unable to get All CCAs");
        } else {
            res.status(200).send(ccas);
        }
    })
})
//get one cca using id
router.get('/ccas/:id', function (req, res) {
    var id = req.params.id;
    db.getCca(id, function (err, cca) {
        if (err) {
            res.status(500).send("Unable to get this CCAs");
        } else {
            res.status(200).send(cca);
        }
    })
})
//create cca
router.post('/ccas', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    if (role != "admin"){
        res.status(401).send("You are not authorized to Add Module");
    } else {
    //same as the name in the html under form action
    db.addCca(data.ccaName, data.ccaLocation, data.StartTime, data.EndTime, function (err, cca) {
        //this is the callback
        //adding 1 event
        if (err) {
            res.status(500).send("Unable to add a new cca");
        } else {
            res.status(200).send(cca);
        }

    })
}
});

router.get('/editcca', function (req, res) {
    res.sendFile(__dirname + "/views/editCca.html");
});

//update cca
router.put('/ccas', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    if (role != "admin"){
        res.status(401).send("You are not authorized to edit cca");
    } else {
    db.updatedCca(data.id, data.ccaName, data.ccaLocation, data.StartTime, data.EndTime,
        function (err, cca) {
            if (err) {
                res.status(500).send("Unable to update CCAs");
            } else {
                res.status(200).send(cca);
            }
        });
    }
})

//delete cca
router.delete('/ccas/:id', function (req, res) {
    var id = req.params.id;
    var role = res.locals.user.role;
    if (role != "admin"){
        res.status(401).send("You are not authorized to delete cca");
    } else {
    db.deleteCca(id, function (err, cca) {
        if (err) {
            res.status(500).send("Unable to delete this CCA");
        } else {
            res.status(200).send(cca);
        }
    });
}
})
//=========================end of cca================================

//=========================Start Login & Logout===========================
router.post('/login', function (req, res) {
    var data = req.body;
    db.login(data.username, data.password, function (err, user) {
        if (err) {
            res.status(401).send("Login unsucessful. Please try again later");
        } else {
            if (user == null) {
                res.status(401).send("Login unsucessful. Please try again later");
            } else {
                var strToHash = user.username + Date.now();
                var token = crypto.createHash('md5').update(strToHash).digest('hex');
                db.updateToken(user._id, token, function (err, user) {
                    res.status(200).json({ 'message': 'Login successful.', 'token': token });
                });
            }
        }
    })
})

router.get("/logout", function (req, res) {
    var token = req.query.token;
    if (token == undefined) {
        res.status(401).send("No tokens are provided");
    } else {
        db.checkToken(token, function (err, user) {
            if (err || user == null) {
                res.status(401).send("Invalid token provided");
            } else {
                db.removeToken(user._id, function (err, user) {
                    res.status(200).send("Logout successfully")
                });
            }
        })
    }
})
//=========================End Login & Logout===========================
//=========================start register student cca===========================
router.get('/registerccas', function (req, res) {
    db.getAllStudentscca(function (err, registerccas) {
        if (err) {
            res.status(500).send("Unable to get all students cca.");
        } else {
            console.log(registerccas)
            res.status(200).send(registerccas);
        }
    })
});

router.post('/registerccas', function (req, res) {
    var data = req.body;
    var userId = res.locals.user._id;
    console.log(userId);// retrieve fr organizer object
    db.addStudentcca(data.ccaName,userId,
        function (err, registercca) {
            if (err) {
                res.status(500).send("Unable to register new ccas");
            } else {
                console.log(registercca)
                    res.status(200).send("CCa has been successfully added!");
            }
        })
});

//=========================End register student cca===========================
//=========================start course user ===========================
router.get('/courseuser', function (req, res) {
    db.getAllCourseuser(function (err, courseusers) {
        if (err) {
            res.status(500).send("Unable to get all course user.");
        } else {
            console.log(courseusers)
            res.status(200).send(courseusers);
        }
    })
});

router.post('/courseuser', function (req, res) {
    var data = req.body;
    var userId = res.locals.user._id;
    console.log(userId);// retrieve fr organizer object
    db.addCourseuser(data.courseName,data.courseID,userId,
        function (err, courseuser) {
            if (err) {
                res.status(500).send("Unable to add new course user");
            } else {
                console.log(courseuser)
                res.status(200).send("Course user has been successfully added!");
            }
        })
});

//========================= End course user ===========================
//========================= Start of student grades ===========================
router.get('/grades', function(req, res){
    db.getGradeForStudent(function(err, grade){
        if (err) {
            res.status(500).send("Unable to get grades");
        } else {
            res.status(200).send(grade);
        }
    })
})
//========================= End of student grades ===========================
//start
router.get('/users/role/:role', function (req, res) {
    var role = req.params.role;
    db.getAllUserbyrole(role, function (err, users) {
        if (err) {
            res.status(500).send("Unable to find user with that role");
        } else {
            res.status(200).send(users);
        }
    });

});

router.get('/payrolls', function (req, res) {
    db.getAllamountteacher(function (err, amount) {
        if (err) {
            res.status(500).send("Unable to get all teachers payroll.");
        } else {
            // console.log(amount)
            res.status(200).send(amount);
        }
    })
});

router.post('/payrolls', function (req, res) {
    var data = req.body;
    console.log(data);
    var role = res.locals.user.role;
    if (role != "admin"){
        res.status(401).send("You are not a admin");
    } else {
    db.addAmountforTeacher(data.amount,data.user,
        function (err, amount) {
            if (err) {
                res.status(500).send("Unable to pay teacher");
            } else {
                console.log(amount)
                res.status(200).send("Successfully paid");
            }
        })
    }
});
//end
//start
router.get('/schoolfees', function (req, res) {
    db.getAllschoolfee(function (err, fees) {
        if (err) {
            res.status(500).send("Unable to get all teachers payroll.");
        } else {
            // console.log(amount)
            res.status(200).send(fees);
        }
    })
});
router.post('/schoolfees', function (req, res) {
    var data = req.body;
    var userId = res.locals.user._id;
    console.log(data);
    var role = res.locals.user.role;
    if (role != "student"){
        res.status(401).send("You are not a student");
    } else {
    db.StudentSchoolfee(data.amount,userId,
        function (err, amount) {
            if (err) {
                res.status(500).send("Unable to pay school fees");
            } else {
                console.log(amount)
                res.status(200).send("Successfully paid");
            }
        })
    }
});
// ===========Start of attendance===========
router.get('/studentmodules/:m', function(req, res){
    var m = req.params.m;
    db.getstudentsbymodule(m,function(err, student){
        if (err) {
            res.status(500).send("Unable to get student");
        } else {
            res.status(200).send(student);
        }
    })
});

router.post('/studentmodules', function (req, res) {
    var data = req.body;
    db. addstudentmodule(data.courseID,data.module,
        function (err, student) {
            if (err) {
                res.status(500).send("Unable to add new module user");
            } else {
                console.log(student)
                res.status(200).send("module user has been successfully added!");
            }
        })
});

router.get('/modules', function (req, res) {
    db.getallmodules(function (err, module) {
        if (err) {
            res.status(500).send("Unable to get Module");
        } else {
            res.status(200).send(module);
        }
    });

});
router.get('/attendancebymodule', function (req, res) {
    res.sendFile(__dirname + "/views/attendancebymodule.html");
});
router.get('/attendanceform', function (req, res) {
    res.sendFile(__dirname + "/views/attendanceform.html");
});
router.post('/submitattendance',function(req,res){
    var data = req.body;
    var role = res.locals.user.role;
    if(role!="teacher"){
        res.status(401).send("You are not authorized to mark attendance");
    }else{
        db.addattendance(data.date,data.name,data.module,data.attendance,function (err, student) {
            if (err) {
                res.status(500).send("Unable to submit attendance");
            } else {
                res.status(200).send(student.student+" has been marked "+student.attendance +" successfully ");
            }
        })
    }
    
});
//============timetable=======================

router.get('/timetable', function (req, res) {
    res.sendFile(__dirname + "/views/timetable.html");
});


router.get('/timetables', function (req, res) {
    db.getAlltimetable(function (err, timetable) {
        if(err){
            res.status(500).send("Unable to find timetable");
        }else{
            res.status(200).send(timetable)
        }
    })
});

router.post('/timetables', function (req, res) {
    var data = req.body;
    var role = res.locals.user.role;
    if (role != "teacher"){
        res.status(401).send("You are not authorized to add timetable");
    }else{
        db.addtimetable(data.day, data.venue,data.module, data.startTime,data.endTime,
            function (err, timetable) {
                if(err){
                    res.status(500).send('Unable to add timetable')
                }else{
                res.status(200).send("successfully add timetable")
                }
            })
    }
    
    });


module.exports = router;

