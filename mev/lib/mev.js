/* Mev evented measurement middleware
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Uses events to dispatch request for measurements to given measurement
 * module so the module itself does not need to handle this.
 * 
 * This is part of the iStrukta Project for internet analyzation (http://measr.net/)
 */

var sys = require('sys'),
		fs = require('fs'),
		net = require('net'),
		EventEmitter = require('events').EventEmitter;

/*
 * mmodule: module being used implementing the needed mev events
 * input: socket to read data from (utf8)
 * output: socket to write result to (utf8)
 * flags: 
 *        flags.debug: enable or disable debugging
 *        flags.timeout: maximum time between responses before shutdown (defaults to 30sec)
 *        flags.file: input and output are no sockets but files, this is implemented for legacy reasons
 */
function Mev(mmodule, input, output, flags) {
	
  var that = this,
      flags = flags || {},
      file = flags.file || false,
      debug = flags.debug || false,
      timeout = flags.timeout || 30000,
      outd,
      ind;
  
  that.mm = mmodule;
  
  // shutdown after TIMEOUT inactivity unless timeout is set to 0
  if(timeout !== 0) td = setTimeout(that.stop, timeout);
    
  that.init = function(){
    logger('starting mev');
		// Events
  	logger('registering events');
  	// Add listener for programm flow
  	that.mm.on('data', that.genReq);
  	that.mm.on('request', that.runReq);
  	that.mm.on('result', that.handleRes);        
		
    if(file) {
      // Setup for file
      outd = fs.openSync(output, 'a');
      ind = fs.readFile(input, 'utf8', function(err, data){
        if(err) throw err;
        that.dataInput(data);
      });
      // Finished Request
    	that.finishRes = function(res){
    		logger('finishResult: ', res)
    	  // reset the inactivity timeout
    	  if(td) {
    	    clearTimeout(td);
    	    td = setTimeout(that.stop, timeout);
        }
        fs.writeSync(outd, res.key + ', ' + res.value + '\n');
        that.emit('finish', res);
    	};
    	// Trigger to communicate with other Mev instances
    	that.mm.on('done', that.finishRes);
    } else {
      // Output socket
      var sout = net.createServer(function(sock){
        that.finishRes = function(res){
      		logger('finishResult: ', res)
      	  // reset the inactivity timeout
      	  if(td) {
      	    clearTimeout(td);
      	    td = setTimeout(that.stop, timeout);
          }
          sock.write(res.key + ', ' + res.value + '\n');
          that.emit('finish', res);        
        }
        // Trigger to communicate with other Mev instances
      	that.mm.on('done', that.finishRes);
      });
      if(parseFloat(output)) {
        sout.listen(parseFloat(output), 'localhost', function(){
          that.emit('output');
        });
      } else {
        try {
          sout.listen(output, function(){
            that.emit('output');
          });          
        } catch(err) {
          console.log('Path to unix input socket is invalid');          
        }
      }

      // Read input from socket
      ind = net.createConnection(input);
      ind.setEncoding('utf8');
      ind.on('data', function(data){
    	  // close connection on EOF
    	  if(data.indexOf('EOF') !== -1) {
          ind.end();
          return;	    
    	  }
    	  that.dataInput(data);
    	});
    }
  }	
	
	// Data input to module
	that.dataInput = function(data){
		logger('dataInput: ', data);
		// Split the data by lines each line specifies a request 
		data.toString().split('\n').forEach(function(el, idx, ary){
			// Check if line is comment or empty
			if(	el.indexOf('#') == -1 && el.trim().valueOf() != '') that.mm.readInput(el);
		});
	};
		
	// Generate Requests
	that.genReq = function(data){
    logger('genReq: ', data);
		that.mm.genReq(data);
	};
	
	// Run Requests
	that.runReq = function(req){
		logger('runReq: ', req);
		that.mm.runReq(req);
	};
	
	// Handle results
	that.handleRes = function(res){
		logger('handleRes: ', res);
		that.mm.handleRes(res);
	};
	
	// Stop
	that.stop = function(){
    logger('deregistering events');
    // remove events
    that.mm.removeAllListeners('data');
    that.mm.removeAllListeners('request');
    that.mm.removeAllListeners('result');
    that.mm.removeAllListeners('done');
    if(file){
      logger('Closing input and output file...');
      try {
        fs.closeSync(outd);
        fs.close(ind);
      } catch (err) {
        // Nothing to close        
      }
    } else {
      logger('Closing input and output socket...');      
      try {
        outd.end();
      } catch(err) {
        // Nothing to end obviously 
      }
      try {
        if(input) input.end();
      } catch(err) {
        // Nothing to end obviously 
      }
    }
    // shutdown done
    logger('shut down');
    that.emit('shutdown');
	};

  // Logging
	function logger(desc, obj) {
		if(debug) { 
			if(typeof(obj) === undefined){
				console.log(desc);
			} else {
				console.log(desc + sys.inspect(obj));
			}
		}
	};	
}

// Extend EventEmitter
Mev.prototype = new EventEmitter;

module.exports = Mev;
