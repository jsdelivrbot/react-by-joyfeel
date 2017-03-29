'use strict';

let co = require('co'),
	exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs');

//100K
const LOG_FILE_MAX_SIZE = 102400;

const c = console;

const MMC_TEST = 'mmc_test',
      MMC_SDHCI_ACPI = 'sdhci-acpi',
      MMC_TEST_KO = 'mmc_test.ko',
      MMC_CORE_KO = 'mmc_core.ko',
      MMC_SDHCI_KO = 'sdhci.ko',
      MMC_SDHCI_ACPI_KO = 'sdhci-acpi.ko',      
      
      PATH_MMC_TEST_KO = path.join(__dirname, '/../driverFile/', MMC_TEST_KO),
      PATH_MMC_CORE = path.join(__dirname, '/../driverFile/', MMC_CORE_KO),
      PATH_MMC_SDHCI = path.join(__dirname, '/../driverFile/', MMC_SDHCI_KO),
      PATH_MMC_SDHCI_ACPI = path.join(__dirname, '/../driverFile/', MMC_SDHCI_ACPI_KO),

      PATH_READ_DATA = path.join(__dirname, '/../driverFile/log/read/'),
      PATH_LOG = path.join(__dirname, '/../driverFile/driver.log'),
      PATH_LOG_DIR = path.join(__dirname, '/../driverFile/log/driver_log/'),
      PATH_LOG_DIR_ALL = path.join(__dirname, '/../driverFile/log/driver_log/*'),
      PATH_EXT_CSD = path.join(__dirname, '/../driverFile/log/EXT_CSD/'),
      PATH_CSD = path.join(__dirname, '/../driverFile/log/CSD/'),
      PATH_RPMB = path.join(__dirname, '/../driverFile/log/RPMB/'),
      PATH_UPLOAD_FILE = path.join(__dirname, '/../driverFile/uploadFile/'),
      PATH_TIMING = path.join(__dirname, '/../driverFile/timing_bus/timing_config'),
      PATH_BUSWIDTH = path.join(__dirname, '/../driverFile/timing_bus/bus_width_config'),
      PATH_DEBUGFS = '~/debugfs/',
      USERID = 'via';

//Global
let g_driverLog = 1;      

String.prototype.pad = function (size) {
    let s = this;

    while (s.length < (size || 2)) {
        s = '0' + s;
    }
 
    return s;
};

function wait1Second (second) {
    return function (done) {
        setTimeout (function () {
            done(null, 'wait1Second done');
        }, second * 1000);
    }
}

function processSend (obj) {
    return function (done) {
        process.send(obj, function (error) {
            if (error !== null) {
                c.log('process send error: ' + error);
                done(null, error); 
            } else {
                done(null, 'process send OK'); 
            }
        });
    };
}

function postWork () {
    return co.wrap(function* (done) {
        yield gExec(`umount ${PATH_DEBUGFS}`);
        done(null, 'postWork ok');
    });
}

function preWork () {
    return co.wrap(function* (done) {
        yield gExec('dmesg -c > /dev/null')         
        yield gExec(`rm -rf ${PATH_LOG_DIR_ALL}`)
        yield gExec(`mount -t debugfs debug ${PATH_DEBUGFS}`)
        yield gExec(`chown -R ${USERID}:${USERID} ${PATH_DEBUGFS}`)

        done(null, 'preWork ok')
    })
}

function logSizeCheck (tempDriverLog) {
    return co.wrap(function* (done) {
        fs.stat(tempDriverLog, (err, stats) => {
            if (stats.size > LOG_FILE_MAX_SIZE) {
                g_driverLog++
            }
            done(null, 'logSizeCheck ok')
        })
    })
}

function getDmesgSend(name, txt) {
    return co.wrap(function* (done) {
        let tempDriverLog = path.join(PATH_LOG_DIR, g_driverLog.toString())
        
        //1. write dmesg to tempDriverLog first
        yield gExec(`dmesg -t >> ${tempDriverLog}`)
        //2. decision the file size
        yield logSizeCheck(tempDriverLog)
        yield gExec('dmesg -c > /dev/null')
        yield processSend({
            name,
            txt
        })

        done(null, 'dmesg ok')
    })
}


function midWorkReset (cmdName) {
    return co.wrap(function* (done) {
        let resultTxt = yield gExec("dmesg -t | grep mmc_test | awk '{print $1}'")

        if (resultTxt === 'mmc_test'){
            resultTxt = 'OK';          
        } else {
            resultTxt = 'error'; 
        }

        yield getDmesgSend(cmdName, resultTxt);
        done(null, 'midWorkReset ok');
    });
}

function hostReset (cmdIndex) {
    return co.wrap(function* (done) {
        let timing,
            bus_width;

        switch (cmdIndex) {
            case '0':
                timing = '00000001';
                bus_width = '0';
            break;
            case '1':
                timing = '00000001';
                bus_width = '1';
            break;
            case '2':
                timing = '00000001';
                bus_width = '2';
            break;
            case '3':
                timing = '00000011';
                bus_width = '0';
            break;
            case '4':
                timing = '00000011';
                bus_width = '1';
            break;
            case '5':
                timing = '00000011';
                bus_width = '2';
            break;   
            case '6':
                timing = '00000111';
                bus_width = '5';
            break;
            case '7':
                timing = '00000111';
                bus_width = '6';
            break;
            case '8':
                timing = '00010111';
                bus_width = '1';
            break;
            case '9':
                timing = '00010111';
                bus_width = '2';
            break;
            case '10':
                timing = '01010111';
                bus_width = '6';
            break;                                   
        }
        yield gExec(`printf ${timing} > ${PATH_TIMING}`);
        yield gExec(`printf ${bus_width} > ${PATH_BUSWIDTH}`);

        yield gExec(`modprobe -r ${MMC_TEST}`);
        yield wait1Second (0.3);
        yield gExec(`modprobe -r ${MMC_SDHCI_ACPI}`);
        yield wait1Second (0.3);
       // yield gExec('modprobe sdhci_acpi');
        yield gExec(`insmod ${PATH_MMC_CORE}`);
        yield wait1Second (0.2);
        yield gExec(`insmod ${PATH_MMC_SDHCI}`);
        yield wait1Second (0.2);
        yield gExec(`insmod ${PATH_MMC_SDHCI_ACPI}`);
        yield wait1Second (0.2);
        yield gExec(`insmod ${PATH_MMC_TEST_KO}`);
        yield wait1Second (1);

        done(null, 'hostReset ok');
    });
}

let MacroCommand = function (loopTimes) {
	return {
		commandList: [],
		add: function (cmd) {
			this.commandList.push(cmd);
		},
		execute: co.wrap(function* () {
            //console.log(`this.commandList.length: ${this.commandList.length}`);
            for (let i = 0; i < loopTimes; i++) {
    			for (let j = 0, command; command = this.commandList[j++]; ) {
    				yield command.execute()
    			}
            }
		})
	}
};

function saveTimestampFile (log_path, timestamp) {
    return co.wrap(function* (done) {
        let file = path.join(log_path, timestamp.toString());
        
        
        //yield gExec(`dmesg | cut -d ']' -f 2,3 | grep -v mmc >> ${file}`)
        yield gExec(`dmesg -t | grep -v mmc >> ${file}`)

        done(null, 'saveTimestampFile ok');
    });
}

function preWork () {
    return co.wrap(function* (done) {
        yield gExec('dmesg -c > /dev/null')         
        yield gExec(`rm -rf ${PATH_LOG_DIR_ALL}`)
        yield gExec(`mount -t debugfs debug ${PATH_DEBUGFS}`)
        yield gExec(`chown -R ${USERID}:${USERID} ${PATH_DEBUGFS}`)

        done(null, 'preWork ok')
    })
}

function gExec (script) {
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

function midWork (cmdName) {
    return co.wrap(function* (done) {
        //let resultTxt = yield gExec("dmesg | cut -d ']' -f 2 | grep Result | awk '{print $3}'");
        let resultTxt = yield gExec("dmesg -t | grep Result | awk '{print $3}'");

        yield getDmesgSend(cmdName, resultTxt);
        done(null, 'midWork ok');
    });
}

/*
function getCmd2(testcase) {
    return co.wrap(function* (done) {
        //const searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile
        //const dbgfsFile = yield gExec(searchDbgfsFile)
        console.log(dbgfsFile)
        console.log('....')
        done(null, '@@@@ midWork ok');
    })
}
*/

/*
function getCmd (testcase) {
    return function (done) {
        //const { dbgfsFile, fileContent } = testcase
        const fileContent = testcase.fileBoxContent
        const searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile
        const dbgfs = yield gExec(searchDbgfsFile)
        const tmpArr = []
              
        let RPMBKey = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[0]
                    ),
            RPMBNonce = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[1]
                    );   

        cmdPayload = cmdPayload.concat(RPMBKey)
        cmdPayload = cmdPayload.concat(RPMBNonce)

        cmdPayload = tmpArr.concat(cmdPayload);
        cmdPayload = cmdPayload.join('#');

        tmpArr = tmpArr.concat(testcase.command.pad(10))

        const cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        done(null, cmd); 
    };
}
*/


let strategies = {
    'rpmb_configuration_write': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            textContent = testcase.textBoxContent,
            fileContent = testcase.fileBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal,
            dbgfsFile

        dbgfsFile = yield gExec(searchDbgfsFile)

        tmpArr.push(testcase.command.pad(10))

        hexTextDecimal = parseInt(textContent[0], 16); 
        cmdPayload = cmdPayload.concat(hexTextDecimal.toString().pad(10))

        let RPMBKey = path.join(
                PATH_UPLOAD_FILE, 
                fileContent[0]
            ),
            RPMBData = path.join(
                PATH_UPLOAD_FILE, 
                fileContent[1]
            ),
            RPMBNonce = path.join(
                PATH_UPLOAD_FILE, 
                fileContent[2]
            )

        cmdPayload = cmdPayload.concat(RPMBKey)
        cmdPayload = cmdPayload.concat(RPMBData)
        cmdPayload = cmdPayload.concat(RPMBNonce)

        cmdPayload = tmpArr.concat(cmdPayload);
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;
        console.log(cmd)
        yield gExec(cmd);
        yield midWork(testcase.name);
    }),
    //RPMB write counter
    'rpmb_counter': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            fileContent = testcase.fileBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal,
            dbgfsFile

        dbgfsFile = yield gExec(searchDbgfsFile)

        tmpArr.push(testcase.command.pad(10))

        let RPMBKey = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[0]
                    ),
            RPMBNonce = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[1]
                    );

        cmdPayload.push(RPMBKey)
        cmdPayload.push(RPMBNonce)

        cmdPayload = tmpArr.concat(cmdPayload);
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        yield gExec(cmd);
        yield midWork(testcase.name);
    }), 
    //normalTestcase
    'A': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile;

        dbgfsFile = yield gExec(searchDbgfsFile);
        cmd = `echo ${testcase.command} > ${dbgfsFile}`;

        yield gExec(cmd);
        yield midWork(testcase.name);
    }),    
    //Read case (opend, predefined)
    //Need to create 'read' folder
    'B': co.wrap(function* (testcase) {
        let cmd,
        	searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
        	textContent = testcase.textBoxContent,
        	cmdPayload,
        	tmpArr = [];

        let dbgfsFile = yield gExec(searchDbgfsFile);

        //1. ['0000000046']
        tmpArr.push(testcase.command.pad(10));
        //2. So stupid! Must to refactor in the future.
        //2. ['0000000046', '0000000000']
        tmpArr.push('0'.pad(10));
        //3. Two text content
        //3. ['0000000046', '0000000000', '0000000000', '0000000016']

        cmdPayload = textContent.reduce(function(acc, text) {
            let hexTextDecimal = parseInt(text, 16); 
                    
            acc.push(hexTextDecimal.toString().pad(10));
            return acc;
        }, []);

        //c.log('testcase.timestamp:', testcase.timestamp);
        //The path of read file, but we need to modify the driver code later.
        let readFile = PATH_READ_DATA + testcase.timestamp;
        //c.log('PATH_READ_DATA:', PATH_READ_DATA);
        //c.log('readFile:', readFile);
        cmdPayload.push(readFile);
        //['0000000046', '0000000000', '0000000000', '0000000016', '/home/via/javascript-project/jspm-react-flux-koa/driverFile/read/1231233']

        cmdPayload = tmpArr.concat(cmdPayload);
        //0000000046#0000000000#0000000000#0000000016#/home/via/javascript/jspm-react-flux-koa/driverFile/read/1231233
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        yield gExec(cmd);
        yield midWork(testcase.name);
    }),
    //write case (opend, predefined)
    'C': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            textContent = testcase.textBoxContent,
            cmdPayload,
            tmpArr = [];

        //c.log('searchDbgfsFile:', searchDbgfsFile);
        let dbgfsFile = yield gExec(searchDbgfsFile);
        //c.log('dbgfsFile:', dbgfsFile);

        //1. ['0000000047']
        tmpArr.push(testcase.command.pad(10));

        //2. So stupid! Must to refactor in the future.
        //2. ['0000000047', '0000000000']
        tmpArr.push('0'.pad(10));

        //3. Two text content
        //3. ['0000000047', '0000000000', '0000000000', '0000000016']
        cmdPayload = textContent.reduce(function(acc, text) {
            let hexTextDecimal = parseInt(text, 16); 

            acc.push(hexTextDecimal.toString().pad(10));
            return acc;
        }, []);

        //c.log('fileContent:', fileContent);        
        //c.log('file is :', testcase.fileBoxContent[0]);

        //The path of write file.
        let writeFile = path.join(PATH_UPLOAD_FILE, testcase.fileBoxContent[0]);
        cmdPayload.push(writeFile);

        cmdPayload = tmpArr.concat(cmdPayload);
        //0000000047#0000000000#0000000000#0000000016#__dirname/../driverFile/uploadFile/pattern_4096
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        yield gExec(cmd);
        yield midWork(testcase.name);        
    }),
    //Erase, trim
    'D': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            textContent = testcase.textBoxContent,
            cmdPayload,
            tmpArr = [];

        let dbgfsFile = yield gExec(searchDbgfsFile);

        //1. ['0000000048']
        tmpArr.push(testcase.command.pad(10));
        //2. So stupid! Must to refactor in the future.
        //2. ['0000000048', '0000000000']
        tmpArr.push('0'.pad(10));
        //3. ['0000000048', '0000000000', '0000000000', '0000004000']

        cmdPayload = textContent.reduce(function(acc, text) {
            let hexTextDecimal = parseInt(text, 16); 
                    
            acc.push(hexTextDecimal.toString().pad(10));
            return acc;
        }, []);

        cmdPayload = tmpArr.concat(cmdPayload);
        //0000000048#0000000000#0000000000#0000016384#
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        yield gExec(cmd);
        yield midWork(testcase.name);
    }),
    //Host reset
    'E': co.wrap(function* (testcase) {
        yield hostReset(testcase.command);
        yield midWorkReset (testcase.name)
    }),
    //Set buffer length
    'F': co.wrap(function* (testcase) {
        let boxContent;
        if (typeof testcase.textBoxContent === 'undefined') {
            boxContent = testcase.selectBoxContent;
        } else {
            boxContent = testcase.textBoxContent;
        }

        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile,
            cmdPayload,
            tmpArr = [];

        dbgfsFile = yield gExec(searchDbgfsFile);

        //1. ['0000000066']
        tmpArr.push(testcase.command.pad(10));

        //Must to refactor in the future.
        //2. ['0000000066', '0000000000']
        tmpArr.push('0'.pad(10));

        //3. ['0000000066', '0000000000', '0000004096']
        cmdPayload = boxContent.reduce(function(acc, text) {
            let mmcArg;
            switch (testcase.command) {
                case '100':
                    mmcArg = parseInt(text, 10);
                    break;
                default:
                    mmcArg = parseInt(text, 16);

            }

            acc.push(mmcArg.toString().pad(10));
            return acc;
        }, []);

        cmdPayload = tmpArr.concat(cmdPayload);
        //0000000066#0000000000#0000000000#0000004096#
        cmdPayload = cmdPayload.join('#');
        
        //console.log(cmdPayload);
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;
        yield gExec(cmd);
        yield midWork(testcase.name);
    }),
    'rpmb_programming_key': co.wrap(function* (testcase) {
        //console.log('===1111===')
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            cmdPayload = [],
            tmpArr = [],
            dbgfsFile;
  
        dbgfsFile = yield gExec(searchDbgfsFile);

        //1. ['0000000047']
        tmpArr.push(testcase.command.pad(10));

        //2. So stupid! Must to refactor in the future.
        //2. ['0000000047', '0000000000']
        tmpArr.push('0'.pad(10));

        //The path of write file.
        let RPMBKey = path.join(
                        PATH_UPLOAD_FILE, 
                        testcase.fileBoxContent[0]
                    );
               
        cmdPayload.push(RPMBKey);

        cmdPayload = tmpArr.concat(cmdPayload);
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;

        console.log(cmd)
        yield gExec(cmd);
        yield midWork(testcase.name);
    }),
    //RPMB Write multiple file
    'rpmb_write': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            textContent = testcase.textBoxContent,
            fileContent = testcase.fileBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal,
            dbgfsFile;

        dbgfsFile = yield gExec(searchDbgfsFile);

        tmpArr.push(testcase.command.pad(10));

        hexTextDecimal = parseInt(textContent[0], 16); 
      
        cmdPayload.push(hexTextDecimal.toString().pad(10))
        cmdPayload.push(textContent[1].toString().pad(10))

        let RPMBKey = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[0]
                    ),
            RPMBData = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[1]
                    ),
            RPMBNonce = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[2]
                    );

        cmdPayload.push(RPMBKey)
        cmdPayload.push(RPMBData)
        cmdPayload.push(RPMBNonce)

        cmdPayload = tmpArr.concat(cmdPayload)
        
        cmdPayload = cmdPayload.join('#')
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`

        //console.log(cmd)
        yield gExec(cmd)
        yield midWork(testcase.name)
    }),
    //RPMB Read multiple file
    'rpmb_read': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            textContent = testcase.textBoxContent,
            fileContent = testcase.fileBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal,
            dbgfsFile

        dbgfsFile = yield gExec(searchDbgfsFile)

        tmpArr = tmpArr.concat(testcase.command.pad(10))

        //startAddr (hex)
        hexTextDecimal = parseInt(textContent[0], 16) 
        cmdPayload = cmdPayload.concat(hexTextDecimal.toString().pad(10))

        //blockCount (hex)
        hexTextDecimal = parseInt(textContent[1], 16)
        cmdPayload = cmdPayload.concat(hexTextDecimal.toString().pad(10))

        //count (dec)
        cmdPayload = cmdPayload.concat(textContent[2].toString().pad(10))

        let RPMBKey = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[0]
                    ),
            RPMBNonce = path.join(
                        PATH_UPLOAD_FILE, 
                        fileContent[1]
                    )

        cmdPayload = cmdPayload.concat(RPMBKey, RPMBNonce)

        cmdPayload = tmpArr.concat(cmdPayload).join('#')
        //cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`
        //console.log(cmd)

        yield gExec(cmd)
        yield midWork(testcase.name)
    }),   
    //save EXT_CSD
    'I': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile

        dbgfsFile = yield gExec(searchDbgfsFile)
        cmd = `echo ${testcase.command} > ${dbgfsFile}`

        yield gExec(cmd)
        yield saveTimestampFile(PATH_EXT_CSD, testcase.timestamp)
        testcase.timestamp += 1
        //Make the different EXT_CSD
        
        yield midWork(testcase.name)
    }),
    //save CSD
    'saveCSD': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile

        dbgfsFile = yield gExec(searchDbgfsFile)
        cmd = `echo ${testcase.command} > ${dbgfsFile}`

        yield gExec(cmd)
        yield saveTimestampFile(PATH_CSD, testcase.timestamp)
        testcase.timestamp += 1

        yield midWork(testcase.name)
    }),
    'cmdIndex6': co.wrap(function* (testcase) {
         let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile,
            textContent = testcase.textBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal;

        dbgfsFile = yield gExec(searchDbgfsFile);

        //1. ['0000000046']
        tmpArr.push(testcase.command.pad(10));
        //2. So stupid! Must to refactor in the future.
        //2. ['0000000046', '0000000000']
        tmpArr.push('0'.pad(10));
        //3. Two text content
        //3. ['0000000046', '0000000000', '0000000161', '0000000001']

        //161
        cmdPayload.push(textContent[0].toString().pad(10));
        //0x01
        hexTextDecimal = parseInt(textContent[1], 16); 
        cmdPayload.push(hexTextDecimal.toString().pad(10));

        cmdPayload = tmpArr.concat(cmdPayload);
        cmdPayload = cmdPayload.join('#');
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`;
        //console.log(cmd)

        yield gExec(cmd);
        yield midWork(testcase.name);       
    }),
    'ext_csd_access_mode': co.wrap(function* (testcase) {
        let cmd,
            searchDbgfsFile = 'find ' + PATH_DEBUGFS + 'mmc0 -name ' + testcase.dbgfsFile,
            dbgfsFile,
            textContent = testcase.textBoxContent,
            cmdPayload = [],
            tmpArr = [],
            hexTextDecimal,
            binaryTextDecimal

        dbgfsFile = yield gExec(searchDbgfsFile)

        //1. ['0000000046']
        tmpArr = tmpArr.concat(testcase.command.pad(10))
        
        //0x01
        hexTextDecimal = parseInt(textContent[0], 2)
        cmdPayload = cmdPayload.concat(hexTextDecimal.toString().pad(10))
        //161
        cmdPayload = cmdPayload.concat(textContent[1].toString().pad(10))
        //10010010
        binaryTextDecimal = parseInt(textContent[2], 2)
        cmdPayload = cmdPayload.concat(binaryTextDecimal.toString().pad(10))

        cmdPayload = tmpArr.concat(cmdPayload)
        cmdPayload = cmdPayload.join('#')
        
        cmd = `echo ${cmdPayload} > ${dbgfsFile}`
        yield gExec(cmd);
        yield midWork(testcase.name);       
    })
}

process.on('message', co.wrap(function* (msg) {
    let testcases = msg.testcases,
    	driverData,
    	normalMacro = MacroCommand(1),
        macroStack = []

    driverData = testcases.reduce((acc, testcase) => {
    	let temp = {},
            data = new Date().valueOf()

        Object.assign(temp, testcase)

        temp.timestamp = data
    	temp.execute = co.wrap(function* () {
    		yield strategies[this.category](this);
		})

    	acc.push(temp)
    	return acc;
    }, [])

    macroStack.push(normalMacro)
	for (let i = 0; i < driverData.length; i++) {
        if (driverData[i].command === 'loop') {
            let loopTimes,
                tempMacro

            loopTimes = driverData[i].textBoxContent[0]
            tempMacro = MacroCommand(loopTimes)
            macroStack.push(tempMacro)
            continue;
        } else if (driverData[i].command === 'end') {
            let popedMacro = macroStack.pop()
            let currentLength = macroStack.length - 1
            macroStack[currentLength].add(popedMacro)
            continue;
        } else {
            let currentMacro = macroStack.pop()
            currentMacro.add(driverData[i])
            macroStack.push(currentMacro)      
        }
	}

    yield preWork()

    //Composition pattern
	yield normalMacro.execute()

    //Umount debugfs etc...
    yield postWork()

    yield processSend({ 
        name: 'Mission complete',
        txt: 'Done'
    })

	process.exit(0)
}))