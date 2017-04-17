var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('promise-mysql');

var app = express();

var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root', // CHANGE THIS :)
    password : '',
    database: 'reddit_api',
    connectionLimit: 10
});

//app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.send('Hello World!');
});

// EXERCISE 1
// app.get('/hello', function(request, response) {
//   response.send('<h1>Hello World!</>');
// })


// EXERCISE 2
app.get('/hello', function(request, response) {
    
    if (request.query.name) {
        response.send('<h1>Hello ' + request.query.name +'</h1>');
    }
    else {
        response.send('<h1>Hello World!</>');
    }
});


// EXERCISE 3
app.get('/calculator/:operation', function(request, response) {
    // console.log(request.query.num1);
    // console.log(request.query.num2);
    // console.log(request.params);
    var num1 = parseInt(request.query.num1);
    var num2 = parseInt(request.query.num2);
    var output = {
        "operation" : request.params.operation,
        "firstOperand": num1,
        "secondOperand": num2
    }
    switch(request.params.operation) {
        case "add":
            output.solution = num1 + num2;
            break;
        case "multiply":
            output.solution = num1 * num2;
            break;
        default:
            output.firstOperand = 0;
            output.secondOperand = 0;
            response.status('400 Bad Request');
   }
   response.send(output);
});


// EXERCISE 4
app.get('/posts', function(request, response) {
    var RedditAPI = require('../reddit-nodejs-api/reddit.js');
    var myReddit = new RedditAPI(connection);
    myReddit.getAllPosts().then(function(result) {
        var output = 
            `<div id="posts">
            <h1>List of posts</h1>
            <ul class="posts-list">`;
        for (var i = 0; i < result.length; i++) {
                output += 
                `
                <li class="post-item">
                    <h2 class="post-item__title">
                        <a href="http://the.post.url.value/">` + result[i].post_title + `</a>
                    </h2>
                    <p>Created by ` + result[i].user.username + `</p>
                </li>
                `;
            //console.log(temp + 'SINRIVER')
            //output += 'a';
            //console.log(output)
        }
        output +=
            `   
                </ul>
                </div>
            `;                                              
        response.send(output);
    })
})


// EXERCISE 5
app.get('/new-post', function(request, response) {
    response.send(`
        <form action="/createPost" method="POST"><!-- why does it say method="POST" ?? -->
          <p>
            <input type="text" name="url" placeholder="Enter a URL to content">
          </p>
          <p>
            <input type="text" name="title" placeholder="Enter the title of your content">
          </p>
          <button type="submit">Create!</button>
        </form>
    `)
})


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
