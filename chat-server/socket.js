var fs   = require('fs');
var path = require('path');


var storageUrl = `http://192.168.31.197:3000/storage/`
var clients = [];
var files = {},
    struct = { 
        name: null, 
        extension: null, 
        size: 0, 
        binary: [], 
        slice: 0
    };


const socket = function(io) {

    io.on('connection', function(socket) {

    socket.on('join', function(req) {

        socket.user = {
            id: socket.id,
            username: req.username,
            avatar: req.avatar,
            status: true,
            joined: Date.now()
        };
        // Store current user session into clients array
        clients.push(socket.user);

        io.to(socket.id).emit('connected', socket.user);

        io.emit('connections', clients);
    });
    

    socket.on('message', function(message) {
        io.to(message.to.id).emit('messageNotify', message);
    });


    socket.on('disconnect', function() {
        const client = socket.user;
        const index = clients.indexOf(client);
        clients.splice(index, 1);
        
        io.emit('connections', clients);

    });


    socket.on('sendAttachment', function(message) {
        var file = message.message;

        if (!files[file.name]) { 
            files[file.name] = Object.assign({}, struct, file); 
            files[file.name].binary = []; 
        }

        file.binary = new Buffer.from(file.binary, 'binary');
        files[file.name].binary.push(file.binary); 
        files[file.name].slice++;

        if (files[file.name].slice * 100000 >= files[file.name].size) { 

            // console.log(`File Size: ${files[file.name].size}`);

            var buffer = Buffer.concat(files[file.name].binary);

            // Save file into stoage folder
            // or uload to AWS
            fs.writeFile(path.join(`${__dirname}/storage/${file.name}`), buffer, (err) => {
                if(err) {
                    console.log(err);
                    return socket.to(message.from.id).emit('faildToSendAttachment', err); 
                }

                message.fileUrl = `${storageUrl}${file.name}`

                socket.emit('sendAttachmentComplete', message);
                io.to(message.to.id).emit('messageNotify', message);
                console.log(`${file.name} file send to ${message.to.username} from ${message.from.username}`);
            });

            
        } else { 
            socket.emit('requestSlice', { 
                currentSlice: files[file.name].slice 
            }); 
        } 
    });

    
});
}

module.exports = socket;