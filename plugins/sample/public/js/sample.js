(function(window, document, $, undefined) {
    'use strict';
    var Sample = function Sample(app) {
        console.log("Loading sample plugin.");
        this.app = app;

        $("#navbarsExampleDefault").append('<button id="sampleButton">sample button</button>');

        this.listen();
    };

    Sample.prototype.listen = function listen() {
        var sample = this;

        $('#sampleButton').click(function(ev) {
            ev.preventDefault();
            sample.sampleButton();
        });

    };

    Sample.prototype.sampleButton = function sampleButton() {
        console.log('sample button pressed',this)
        this.app.socket.emit("/sample/sampleButton", {
           content:"hello"
        });
    };

    window.MyApp.plugins.push(Sample);

}(window, document, jQuery));
