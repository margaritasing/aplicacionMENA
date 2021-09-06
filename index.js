var Express = require("express");
var bodyParser = require("body-parser");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require("mongodb").MongoClient;
const { request, response } = require("express");
var CONNECTION_STRING = "mongodb+srv://xxxxxxxxxx_sing:xxxxxxxxxxxx@cluster0.xxxxxxxz.mongodb.net/institutodb?retryWrites=true&w=majority"


















var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname + '/Photos'));


var cors = require('cors')
app.use(cors())


var DATABASE = "institutodb";
var database;

app.listen(49146, () => {

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
    })

});

app.get('/', (request, response) => {
    response.json('Hello World');
})


app.get('/api/department', (request, response) => {

    database.collection("Departaments").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })

})

app.post('/api/department', (request, response) => {

    database.collection("Departaments").count({}, function(error, numOfDocs) {
        if (error) {
            console.log(error);
        }

        database.collection("Departaments").insertOne({
            DepartmentId: numOfDocs + 1,
            DepartmentName: request.body['DepartmentName']
        });

        response.json("Added Successfully");
    })

})


app.put('/api/department', (request, response) => {

    database.collection("Departaments").updateOne(
        //Filter Criteria
        {
            "DepartmentId": request.body['DepartmentId']
        },
        //Update
        {
            $set: {
                "DepartmentName": request.body['DepartmentName']
            }

        }
    );

    response.json("Updated Successfully");
})



app.delete('/api/department/:id', (request, response) => {

    database.collection("Departaments").deleteOne({
        DepartmentId: parseInt(request.params.id)
    });

    response.json("Deleted Successfully");
})



app.get('/api/employee', (request, response) => {

    database.collection("Employee").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })

})

app.post('/api/employee', (request, response) => {

    database.collection("Employee").count({}, function(error, numOfDocs) {
        if (error) {
            console.log(error);
        }

        database.collection("Employee").insertOne({
            EmployeeId: numOfDocs + 1,
            EmployeeName: request.body['EmployeeName'],
            Department: request.body['Department'],
            DateOfJoining: request.body['DateOfJoining'],
            PhotoFileName: request.body['PhotoFileName'],
        });

        response.json("Added Successfully");
    })

})


app.put('/api/employee', (request, response) => {

    database.collection("Employee").updateOne(
        //Filter Criteria
        {
            "EmployeeId": request.body['EmployeeId']
        },
        //Update
        {
            $set: {
                EmployeeName: request.body['EmployeeName'],
                Department: request.body['Department'],
                DateOfJoining: request.body['DateOfJoining'],
                PhotoFileName: request.body['PhotoFileName'],
            }

        }
    );

    response.json("Updated Successfully");
})



app.delete('/api/employee/:id', (request, response) => {

    database.collection("Employee").deleteOne({
        EmployeeId: parseInt(request.params.id)
    });

    response.json("Deleted Successfully");
})


app.post('/api/employee/savefile', (request, response) => {

    fs.writeFile("./Photos/" + request.files.file.name,
        request.files.file.data,
        function(err) {
            if (err) {
                console.log(err);
            }

            response.json(request.files.file.name);
        }
    )
})
