(function(window, document, $, undefined) {
        
    var hostname = document.location.hostname ? document.location.hostname : "localhost";

    var MyApp = function MyApp() {
        //this.socket = io.connect('http://' + hostname);
        this.socket = io.connect();
        this.loadPlugins();

        // Basic socket messages
        this.socket.on('/message', function(data) {
        	console.log(JSON.stringify(data));
        });
        
    };

    MyApp.prototype.loadPlugins = function loadPlugins() {
        var myApp = this;
        MyApp.plugins.forEach(function(plugin) {
            new plugin(myApp);
        });
    };

    // Static array containing all plugins to load
    MyApp.plugins = [];

    window.MyApp = MyApp;
}(window, document, jQuery));
