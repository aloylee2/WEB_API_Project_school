var mongoose = require('mongoose');
var schema = mongoose.Schema;
var courseSchema = {};
var courseModel;
var moduleSchema = {};
var moduleModel;
var ccaSchema = {};
var ccaModel;
var bookingSchema ={};
var bookingModel;
var facilitySchema ={};
var facilityModel;
var userSchema ={};
var userModel;
var studentsccaSchema ={};
var studentsccaModel;
var courseuserSchema ={};
var courseuserModel;
var gradeSchema = {};
var gradeModel;
var payrollSchema = {};
var payrollModel;
var schoolfeeSchema = {};
var schoolfeeModel;
var invoiceSchema = {};
var studentmoduleSchema={};
var studentmoduleModel;
var attendanceSchema={};
var attendanceModel;
var timetableSchema ={};
var timetableModel ={};

mongoose.set('debug', true);

var database = {
    connect: function () {
        mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', function (err) {
            if (err == null) {
                console.log("Connected to MongoDB");
                // course schema //
                courseSchema = schema({
                    courseName: String,
                    courseDesc: String,
                    courseID : String
                });
                // module schema //
                moduleSchema = schema({
                    moduleName: String,
                    moduleDesc: String,
                    credit : Number,
                    hour: Number,
                    course: {
                        type: schema.Types.ObjectId,
                        ref: 'courses'
                    }
                });
                courseuserSchema = schema ({
                    courseName: String,
                    courseID: String,
                    user: {
                        type: schema.Types.ObjectId,
                        ref: 'users'
                    },
                    course: {
                        type: schema.Types.ObjectId,
                        ref: 'courses'
                    }
                });
                //cca schema //
                ccaSchema = schema({
                    ccaName: String,
                    ccaLocation: String,
                    StartTime:String,
                    EndTime:String
                });
                studentsccaSchema = schema({
                    ccaName:String,
                    user: {
                        type: schema.Types.ObjectId,
                        ref: 'users'
                    }
                });
                //user schema//
                userSchema = schema({
                    username: String,
                    password: String,
                    token: String,
                    name: String,
                    emailaddress: String,
                    role:String
                });
                // booking for facilities schema //
                bookingSchema = schema({
                    student: String,
                    facility: String,
                    start: {
                        date: String,
                        time: String
                    },
                    end: {
                        date: String,
                        time: String
                    }
                });
                // facility schema //
                facilitySchema = schema({
                    facility:String
                });

                //grade schema//
                gradeSchema = schema({
                    grades: String,
                    courseuser: {
                        type: schema.Types.ObjectId,
                        ref: 'courseusers',
                    },
                    module : {
                        type: schema.Types.ObjectId,
                        ref: 'modules'
                    }
                });

                //payroll schema//
                payrollSchema = schema({
                    amount:Number,
                    user :{
                        type: schema.Types.ObjectId,
                        ref: 'users',
                    }
                })
                schoolfeeSchema = schema({
                    amount:Number,
                    user :{
                        type: schema.Types.ObjectId,
                        ref: 'users',
                    }
                })
                //attendance
                studentmoduleSchema = schema({
                    courseuser: {
                        type: schema.Types.ObjectId,
                        ref: 'courseusers',
                    },
                    module: String
                })

                attendanceSchema =schema({
                    date : String,
                    student:String,
                    module:String,
                    attendance: String
                })
                timetableSchema =schema({
                    day:String,
                    venue:String,
                    module:String,
                    startTime:String,
                    endTime:String,
                })

                //establishing models
                var connection = mongoose.connection;
                courseModel = connection.model('courses', courseSchema);
                moduleModel = connection.model('modules', moduleSchema);
                ccaModel = connection.model('ccas', ccaSchema);
                bookingModel = connection.model('booking', bookingSchema);
                facilityModel = connection.model('facilities',facilitySchema);
                userModel = connection.model('users',userSchema);
                studentsccaModel = connection.model('studentscca', studentsccaSchema);
                courseuserModel = connection.model('courseusers',courseuserSchema)
                gradeModel = connection.model('grades', gradeSchema);
                payrollModel = connection.model('payrolls',payrollSchema);
                schoolfeeModel = connection.model('schoolfees',schoolfeeSchema);
                studentmoduleModel = connection.model('studentmodule', studentmoduleSchema);
                attendanceModel = connection.model(' attendances', attendanceSchema);
                timetableModel = connection.model('timetables',timetableSchema)

            } else {
                console.log("Error connecting to MongoDB");
            }
        })
    },
    //course database function  start//
    addCourse: function (cn, cdesc, cid, callback) {
        var newCourse = new courseModel({
            courseName: cn,
            courseDesc: cdesc,
            courseID: cid
        })
        newCourse.save(callback);
    },
    getAllCourses: function (callback) {
        courseModel.find({}, callback);
    },
    getCourse: function (id, callback) {
        courseModel.find({ _id: id }, callback);
    },
    updateCourse: function (id, cn, cdesc, callback) {
        var updateCourse = {
            courseName: cn,
            courseDesc: cdesc,
        }
        courseModel.findByIdAndUpdate(id, updateCourse, callback);
    },
    deleteCourse: function (cid, callback) {
        courseModel.deleteOne({ _id: cid }, callback);
    },
    //course database function end//

    //module database function start//
    addModule: function (mn, mdesc, crd, h, cid, callback) {
        var newModule = new moduleModel({
            moduleName: mn,
            moduleDesc: mdesc,
            credit: crd,
            hour: h,
            course: cid
        });
        newModule.save(callback);
    },
    getModuleByCourseID: function (id, callback) {
        var courseobjId = new mongoose.Types.ObjectId(id);
        moduleModel.find({ course: courseobjId }, callback);
    },
    deleteModule: function (mid, callback) {
        moduleModel.deleteOne({course: mid}, callback);
    },
    //module database function end//

    //==========start of CCA==========

    //adding CCA
    addCca: function (n, l, st, et, callback) {
        var newCca = new ccaModel({
            ccaName: n,
            ccaLocation: l,
            StartTime: st,
            EndTime: et
        });
        newCca.save(callback);
    },
    //Getting all CCA
    getAllCcas: function (callback) {
        ccaModel.find({}, callback);
    },
    //Getting one CCA
    getCca: function (id, callback) {
        ccaModel.findById(id, callback);
    },
    //Update CCA
    updatedCca: function (id, n, l, st, et, callback) {
        var updatedCca = {
            ccaName: n,
            ccaLocation: l,
            StartTime: st,
            EndTime: et
        };
        ccaModel.findByIdAndUpdate(id, updatedCca, callback);
    },
    //Delete CCA
    deleteCca: function (id, callback) {
        ccaModel.findByIdAndDelete(id, callback);
    },
    //==========End of CCA===========

    //==========Start of facilities========//
    bookfacility: function(s, f, sd, st, ed, et, callback) {
        var newbooking = new bookingModel({
            student: s,
            facility: f,
            start: {
                date: sd,
                time: st
            },
            end: {
                date: ed,
                time: et
            }
        });
        newbooking.save(callback);
    },

    getAllBookings: function(callback) {
        bookingModel.find({},callback);
    },
    getstudentbooking: function(student, callback) {
        bookingModel.find({student:student},callback);
    },
    getbooking: function(id, callback) {
        bookingModel.findById(id,callback);
    },
    updatebooking: function(id, s, f, sd, st, ed, et,callback) {
        var updatedbooking = {
            student: s,
            facility: f,
            start: {
                date: sd,
                time: st
            },
            end: {
                date: ed,
                time: et
            }
        };
        bookingModel.findByIdAndUpdate(id, updatedbooking, callback);
    },
    deletebooking: function(id,callback) {
        bookingModel.findByIdAndDelete(id,callback);
    },
    getfacilities:function(callback){
        facilityModel.find({},callback);
    },
    //==========End  of facilities==========//
    //==========Start Student login function==========//
    login: function (u, p, callback) {
        userModel.findOne({ username: u, password: p }, callback);
    },
    updateToken: function (id, token, callback) {
        userModel.findByIdAndUpdate(id, { token: token }, callback);
    },
    checkToken: function(token,callback) {
        userModel.findOne({token:token},callback);
    },
    removeToken: function(id,callback) {
        userModel.findByIdAndUpdate(id, {$unset: {token: 1}},callback);
    },
    //==========end login function==========//
    //==========start of user==============
    //adding user
    addUser: function (u,p,n, e, r, callback) {
        var newUser = new userModel({
                username: u,
                password: p,
                name: n,
                emailaddress: e,
                role:r
        });
        newUser.save(callback);
    },

    //Getting all user
    getAllUser: function (callback) {
        userModel.find({}, callback);
    },
    //Getting one user
    getUserbytoken: function (t, callback) {
        userModel.find({token:t}, callback);
    },
    getUserbyid: function (id, callback) {
        userModel.findById(id, callback);
    },
    updateuser: function(id,u,p,e,callback){
        var updatedUser= {
            username: u,
            password: p,
            emailaddress: e
        }

        userModel.findByIdAndUpdate(id, updatedUser, callback);
    },

    //Delete user
    deleteUser: function (id, callback) {
        userModel.findByIdAndDelete(id, callback);
    },
    //==========End of user==========
    //==========start of registrate cca==========
    getAllStudentscca: function (callback) {
        studentsccaModel.find({}, callback);
        // studentsccaModel.find({}).populate('user').exec(callback);

    },
    addStudentcca: function (n,oid, callback) {
        var newStudentscca = new studentsccaModel({
            ccaName: n,            
            user: oid
        });
        newStudentscca.save(callback);
    },
    //==========end of registrate cca==========
    //==========start of course user ==========
    getAllCourseuser: function (callback) {
        courseuserModel.find({}, callback);
        // studentsccaModel.find({}).populate('user').exec(callback);

    },
    addCourseuser: function (cn,cid,oid, callback) {
        var newCourseuser = new courseuserModel({
            courseName: cn,
            courseID:cid,            
            user: oid
        });
        newCourseuser.save(callback);
    },
    //==========end of course user==========
    //==========start of student grade=======
    getGradeForStudent: function(callback) {
        gradeModel
            .find({})
            .populate({
                path: 'courseuser',
                populate: {
                    path: 'user'
                }
            })
            .populate({
                path: 'module'
            })
            .exec(callback)
    },
    //==========end of student grade=======
    //===========start of payroll============
    getAllUserbyrole: function(r,callback){
        userModel.find({role :new RegExp(r,'i')}, callback);
    },
    getAllamountteacher: function (callback) {
        payrollModel.find({}).populate('user').exec(callback);
    },
    addAmountforTeacher: function(a,oid,callback)
    {
        var newpayroll = new payrollModel({
            amount:a,
            user:oid
        });
        newpayroll.save(callback);
    },
    getoneamount: function (id, callback) {
        payrollModel.findById(id).populate('user').exec(callback);
    },
    //===========End of payroll============
    //===========start of schoolfee============
    StudentSchoolfee: function(a,oid,callback){
        var newschoolfee = new schoolfeeModel({
            amount:a,
            user:oid
        });
        newschoolfee.save(callback)
    },
    getAllschoolfee: function (callback) {
        schoolfeeModel.find({}).populate('user').exec(callback);
    },
    getoneschoolfee: function (id, callback) {
        schoolfeeModel.findById(id).populate('user').exec(callback);
    },
    //===========end of schoolfee============
 //==============start of attendance ==========
    getstudentsbymodule: function(m,callback){
        studentmoduleModel
            .find({module:m})
            .populate({
                path: 'courseuser',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            })
            .exec(callback)
    },
    addstudentmodule:function(cid,m,callback){
        var newstudentmodule = new studentmoduleModel({
            courseuser:cid,
            module:m
        });
        newstudentmodule.save(callback)
    },
    getallmodules:function(callback){
        moduleModel.find({}, callback);
    },
    addattendance:function(d,n,m,p,callback){
        var newattendance = new attendanceModel({
            date:d,
            student:n,
            module:m,
            attendance:p
        });
        newattendance.save(callback)
    },
    //==============timetable start===============
    getAlltimetable:function(callback){
        timetableModel.find({}, callback);
    },
    addtimetable:function(d,v,m,s,e,callback){
        var newtimetable = new timetableModel({
            day:d,
            venue:v,
            module:m,
            startTime:s,
            endTime:e
        });
        newtimetable.save(callback);
    },
    gettimetable: function(id, callback) {
        timetableModel.findById(id,callback);
    },
    

    
}

module.exports = database;