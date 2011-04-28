/* Mev evented measurement middleware
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Uses events to dispatch request for measurements to given measurement
 * module
 * 
 * This is part of the iStrukta Project for internet analyzation
 */

var redis = require('redis'),
		sys = require('sys'),
		fs = require('fs'),
		EventEmitter = require('events').EventEmitter;

function Mev(mmodule, infile, debug, stat, fileoutput, redisidx, selfshutdown) {
	
  var self = this
    , outfd
    , dbidx
; self.db = null
  self.mm = mmodule

  // If selfshutdown is turned of set count to 1 and it will not be modified
; (selfshutdown) ? self.active_req_count = 0 : self.active_req_count = -1
	/*	Get DB connection this should be accessible from the outside 
		so it is exported with the module to be used in the caller */ 

	if(!fileoutput) {
    self.db = redis.createClient()
	  self.db.on('error', function(err){ 
		  console.log('Error' + err);
  	})
    // Select the right index
    self.db.select(redisidx, function(){
	    // Clear DB for new resulsts
    	self.db.flushdb()
    })
  } else {
    // Open the output file in append mode
    outfd = fs.openSync(fileoutput, 'a');
  }

	
	// Read the input file
	this.readData = function(){
		logger('reading ', infile)
		fs.readFile(infile, 'utf8', function(err, data){
			if(err) throw err
		;	self.dataInput(data)
		});
	};
	
	// Data input to module
	this.dataInput = function(data){
		logger('dataInput: ', data)
		// Split the data by lines each line specifies a request 
		data.toString().split('\n').forEach(function(el, idx, ary){
			// Check if line is comment or empty
			if(	el.indexOf('#') == -1 && el.trim().valueOf() != '') self.mm.readInput(el);
		});
	};
	
	this.regEvents = function(){
		logger('registering events');
		// Add listener for programm flow
		self.mm.on('data', self.genReq);
		self.mm.on('request', self.runReq);
		self.mm.on('result', self.handleRes);        
		// Trigger to communicate with other Mev instances
		self.mm.on('done', self.finishRes);
	};
	
	// Finished Request
	this.finishRes = function(res){
		logger('finishResult: ', res)
    if(!fileoutput) {
  		self.db.set(res['key'], res['value'], function(){
	  			self.emit('finish', res)
		  })
    } else {
      fs.writeSync(outfd, res['key'] + ', ' + res['value'] + '\n')
      self.emit('finish', res)
    }
    // Attempt shutdown if all request are run
    if(!self.active_req_count) setTimeout(self.stop(), 2000)
	};
	
	
	// Generate Requests
	this.genReq = function(data){
    autoshutdown(1);
    logger('genReq: ', data)
		self.mm.genReq(data)
	};
	
	// Run Requests
	this.runReq = function(req){
		logger('runReq: ', req)
		self.mm.runReq(req)
	}
	
	// Handle results
	this.handleRes = function(res){
    autoshutdown(-1)
    status()
		logger('handleRes: ', res)
		self.mm.handleRes(res)
	}
	
	/*** Start mev ***/
	this.start = function(){
		logger('starting mev');
		// Events
		self.regEvents();
		self.readData();
	};	

	/*** Helpers ***/ 
	function logger(desc, obj) {
		if(debug) { 
			if(typeof(obj) === 'undefined'){
				console.log(desc);
			} else {
				console.log(desc + sys.inspect(obj));
			}
		}
	}
	
  function autoshutdown(count){
    if(selfshutdown) {
      self.active_req_count += count
    }
  }

	function status() {
		if(stat) {
			console.log('currently active requests: ' + self.active_req_count)
		}
	}
	
	this.stop = function(){
    // Only shutdown if requests are all handled
    if(!self.active_req_count) {
      logger('deregistering events')
      self.mm.removeAllListeners('data')
      self.mm.removeAllListeners('request')
      self.mm.removeAllListeners('result')
      self.mm.removeAllListeners('done')
      if(self.db) {
        logger('closing database connection')
        setTimeout(self.db.end(), 2000)
      }
      if(outfd) {
        logger('closing file')
        fs.closeSync(outfd)
      }
      logger('shut down')
      self.emit('shutdown')
    }
	}
}

// Extend EventEmitter
Mev.prototype = new EventEmitter;

module.exports = Mev;
