'use strict';

let router = require('koa-router')(),
    exec = require('child_process').exec,
    fork = require('child_process').fork,
    co = require('co'),
    fs = require("fs"),
    parse = require('co-busboy'),
    path = require('path'),
    socketIo = require('socket.io'),
    child,
    chat = {};

const MMC_BLOCK = 'mmc_block',
    MMC_TEST = 'mmc_test',
    PATH_DEBUGFS = '~/debugfs/',
    CMDJSONPATH = 'driverFile/CMD.jsons',
	UploadFolder = path.join(__dirname, '/../driverFile/uploadFile'),
    RESTARTFILE = 'driverFile/restart.json',
    c = console;


function gExec(script) {
    return function (done) {
        exec(script, function (error, stdout, stderr) {
            //TODO: refactor
            if (error !== null) {
                c.log('exec error: ' + error);
                done(null, error); 
            } else {
                done(null, stdout.replace(/(\r\n|\n|\r)/gm,"")); 
            }
        });
    };
}

chat.io = false;

//Called by index.js
chat.router = router;
chat.socket = false;

//chat initialization with the passing http object
chat.initialize = function (http) {
	this.io = socketIo(http);
	this.ioListen();
}

// major socket listening method
chat.ioListen = function () {	
	let self = this;

	this.io.on('connection', function(socket){
		self.socket = socket;
		self.disconnect(socket);
	});
}

chat.disconnect = function (socket) {
	socket.on('disconnect', co.wrap(function* () {
		child.kill();

        c.log('Refresh and umout');
        //c.log(`umount ${PATH_DEBUGFS}`);
        yield gExec(`umount ${PATH_DEBUGFS}`);

        //c.log(`modprobe -r ${MMC_TEST}`);
        //yield gExec(`modprobe -r ${MMC_TEST}`);    
        
		
        //c.log(`modprobe -r ${MMC_BLOCK}`);
        //yield gExec(`modprobe -r ${MMC_BLOCK}`); 

		c.log('Browser closed');
	}));
}

chat.forkChild = (scriptPath, testcases) => {
	return done => {
		let sendData = {
            testcases
		}
		child = fork(scriptPath)
		child.send(sendData)

		child.on('message', msg => {
            chat.socket.emit('result', msg)

            if (msg.txt === 'ERROR' || msg.txt === 'error') {
          	    c.log('Child ERROR:', msg);
          	    child.kill();
            }
            /*
              if (msg.txt !== 'OK') {
                c.log('Child ERROR:', msg);
                child.kill();
              }
            */
		})

		child.on('close', (code) => {
			console.log('child process exited with code', code);
			done(null, 'child close'); 
		})
	}
}

let writeFile = function(path, data) {
    return function(fn) {
        fs.writeFile(path, data, fn);
    }
};

chat.router.post('/', 
    //Save the script file
    function* (next) {
        let writeData = JSON.stringify(this.request.body);
        
        yield writeFile(CMDJSONPATH, writeData);
        yield next;
    },
    function* (next) {
    	c.log(this.request.body);
    	yield chat.forkChild (__dirname + '/cmdExec.js', this.request.body);
    	//yield chat.forkChild (cmdExec, this.request.body);
        yield next;
    },
    function* (next) {
        c.log('/ return 200');
        response(this.response, 200, '2000000');
	}
);

function downloadCMDScript () {
    return function (done) {
        fs.readFile(CMDJSONPATH, function (err, data) {

            c.log("Asynchronous read");

            done(null, data);
        });
    };
}

//Download script file
chat.router.get('/storedScript', 
	function* (next) {
    	c.log('User is downloading script files now');

    	let scriptFile = yield downloadCMDScript();
      	c.log('/storedScript return 200');
    	response(this.response, 200, scriptFile);
    }
);

//Send testcase files to Server
chat.router.post('/upload', 
	function* (next) {
	    c.log('User is uploading script file now');
	    let parts,
	        part;

	    parts = parse(this);

	    while (part = yield parts) {
	        if (typeof part.filename !== 'undefined') {
	            let stream;
	            //__dirname was somthing like '/foo/bar' rather than '/foo/bar/'
	            stream = fs.createWriteStream(path.join(UploadFolder, part.filename));
	            part.pipe(stream);
	            c.log('uploading %s -> %s', part.filename, stream.path);      
	        }
	    }
    	yield next;
    }, 
    function* (next) {
    	c.log('Upload file successfully');
    	response(this.response, 200, 'Upload file success!');
	}
);

//Kill child process
chat.router.post('/kill', 
	function* (next) {
	    c.log('User wants to kill the execution script and umout debugfs');

	    child.kill();

		c.log(`umount ${PATH_DEBUGFS}`);
		yield gExec(`umount ${PATH_DEBUGFS}`);

		//c.log(`modprobe -r ${MMC_TEST}`);
		//yield gExec(`modprobe -r ${MMC_TEST}`);    

		//......
		//c.log(`insmod ${PATH_MMC_BLOCK}`);
		//yield gExec(`insmod ${PATH_MMC_BLOCK}`); 	    


	    yield next;
	}, 
	function* (next) {
		c.log('Killed successfully');
    	response(this.response, 200, 'Killed executed command success!');
	}
);

function response(res, code, msg) {
    res.status = code;
    res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
    res.body = msg;
    //c.log("response: code="+code+"\n"+msg+"\n");
}

module.exports = chat;