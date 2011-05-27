/* Mev evented measurement middleware
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Uses events to dispatch request for measurements to given measurement
 * module so the module itself does not need to handle this.
 * 
 * This is part of the iStrukta Project for internet analyzation (http://measr.net/)
 */

var redis = require('redis'),
		sys = require('sys'),
		fs = require('fs'),
		EventEmitter = require('events').EventEmitter;

function Mev(mmodule, infile, debug, stat, fileoutput, redisidx, thatshutdown) {
	
  var that = this,
      outfd,
      dbidx;
      
  that.db = null;
  that.mm = mmodule;

  // If thatshutdown is turned of set count to 1 and it will not be modified
  (thatshutdown) ? that.active_req_count = 0 : that.active_req_count = -1;

	// Get DB connection this should be accessible from the outside 
	// so it is exported with the module to be used in the caller
	if(!fileoutput) {
    that.db = redis.createClient();
	  that.db.on('error', function(err){ 
		  console.log('Error' + err);
  	})
    // Select the right index
    that.db.select(redisidx, function(){
	    // Clear DB for new resulsts
    	that.db.flushdb();
    })
  } else {
    // Open the output file in append mode
    outfd = fs.openSync(fileoutput, 'a');
  }

	
	// Read the input file
	that.readData = function(){
		logger('reading ', infile);
		fs.readFile(infile, 'utf8', function(err, data){
			if(err) throw err;
			that.dataInput(data);
		});
	};
	
	// Data input to module
	that.dataInput = function(data){
		logger('dataInput: ', data);
		// Split the data by lines each line specifies a request 
		data.toString().split('\n').forEach(function(el, idx, ary){
			// Check if line is comment or empty
			if(	el.indexOf('#') == -1 && el.trim().valueOf() != '') that.mm.readInput(el);
		});
	};
	
	that.regEvents = function(){
		logger('registering events');
		// Add listener for programm flow
		that.mm.on('data', that.genReq);
		that.mm.on('request', that.runReq);
		that.mm.on('result', that.handleRes);        
		// Trigger to communicate with other Mev instances
		that.mm.on('done', that.finishRes);
	};
	
	// Finished Request
	that.finishRes = function(res){
		logger('finishResult: ', res)
    if(!fileoutput) {
  		that.db.set(res.key, res.value, function(){
	  			that.emit('finish', res);
		  })
    } else {
      fs.writeSync(outfd, res.key + ', ' + res.value + '\n')
      that.emit('finish', res);
    }
    // Attempt shutdown if all request are run
    if(!that.active_req_count) setTimeout(that.stop(), 2000);
	};
	
	
	// Generate Requests
	that.genReq = function(data){
    autoshutdown(1);
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
    autoshutdown(-1);
    status();
		logger('handleRes: ', res);
		that.mm.handleRes(res);
	};
	
	/*** Start mev ***/
	that.start = function(){
		logger('starting mev');
		// Events
		that.regEvents();
		that.readData();
	};	

	/*** Helpers ***/ 
	function logger(desc, obj) {
		if(debug) { 
			if(typeof(obj) === undefined){
				console.log(desc);
			} else {
				console.log(desc + sys.inspect(obj));
			}
		}
	};
	
  function autoshutdown(count){
    if(thatshutdown) {
      that.active_req_count += count;
    }
  };

	function status() {
		if(stat) {
			console.log('currently active requests: ' + that.active_req_count);
		}
	};
	
	that.stop = function(){
    // Only shutdown if requests are all handled
    if(!that.active_req_count) {
      logger('deregistering events');
      that.mm.removeAllListeners('data');
      that.mm.removeAllListeners('request');
      that.mm.removeAllListeners('result');
      that.mm.removeAllListeners('done');
      if(that.db) {
        logger('closing database connection');
        setTimeout(that.db.end(), 2000);
      }
      if(outfd) {
        logger('closing file');
        fs.closeSync(outfd);
      }
      logger('shut down');
      that.emit('shutdown');
    }
	};
}

// Extend EventEmitter
Mev.prototype = new EventEmitter;

module.exports = Mev;
