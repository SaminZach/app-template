function sample(name, deps) {
    console.log('sample pluggin loaded!',name);


     deps.io.sockets.on('connection', function(socket) {
        console.log('connection')
        socket.on('/sample/sampleButton', function(params) {
        	console.log('sample button clicked');
           // deps.io.sockets.emit('/message', params);
            //deps.client.animateLeds(params.name, params.hz, params.duration);
        });

     });

};

module.exports = sample