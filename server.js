var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var USERS_FILE = path.join(__dirname, 'users.json'); // user.json文件的路径

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
//使用body-parser中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 中间件，每个请求都会进行处理.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// 处理/api/users的GET请求
app.get('/api/users', function(req, res) {
  fs.readFile(USERS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1); //退出应用
    }
    res.json(JSON.parse(data));
  });
});

//处理/api/users的POST请求
app.post('/api/users', function(req, res) {
  fs.readFile(USERS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var users = JSON.parse(data);
    var user = {
      name: req.body.name,
      email: req.body.email
    };
    users.push(user);
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json("{code: 200, message: 'Add user successful.'}");
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});