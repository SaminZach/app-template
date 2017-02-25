var express = require('express'),
    favicon = require('express-favicon'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    server = require("http").createServer(app),
    io = require('socket.io').listen(server)

// Fetch configuration
try {
    var config = require('./config');
} catch (err) {
    console.log("Missing or corrupted config file. Have a look at config.js.example if you need an example.");
    process.exit(-1);
}


// Override the drone ip using an environment variable,
// using the same convention as node-ar-drone
var app_ip = process.env.APP_IP || '192.168.1.1';

// Keep track of plugins js and css to load them in the view
var scripts = [],
    styles = [];

app.set('port', process.env.PORT || 1500);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs', { pretty: true });
app.use(favicon());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/components", express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(req, res) {
    res.render('index', {
        title: 'app-template',
        scripts: scripts,
        styles: styles
    });
});

// Process new websocket connection
io.sockets.on('connection', function(socket) {
    socket.emit('event', { message: 'Welcome to myApp :-)' });
});


// Prepare dependency map for plugins
var deps = {
    server: server,
    app: app,
    io: io,
    config: config
};


// Load the plugins
var dir = path.join(__dirname, 'plugins');

function getFilter(ext) {
    return function(filename) {
        return filename.match(new RegExp('\\.' + ext + '$', 'i'));
    };
}

config.plugins.forEach(function(plugin) {
    console.log("Loading " + plugin + " plugin.");
    // Load the backend code
    require(path.join(dir, plugin))(plugin, deps);

    // Add the public assets to a static route
    if (fs.existsSync(assets = path.join(dir, plugin, 'public'))) {
        app.use("/plugin/" + plugin, express.static(assets));
    }

    // Add the js to the view
    if (fs.existsSync(js = path.join(assets, 'js'))) {
        fs.readdirSync(js).filter(getFilter('js')).forEach(function(script) {
            scripts.push("/plugin/" + plugin + "/js/" + script);
        });
    }

    // Add the css to the view
    if (fs.existsSync(css = path.join(assets, 'css'))) {
        fs.readdirSync(css).filter(getFilter('css')).forEach(function(style) {
            styles.push("/plugin/" + plugin + "/css/" + style);
        });
    }
});

// Start the web server
server.listen(app.get('port'), function() {
    console.log('app-template is listening on port ' + app.get('port'));
});
