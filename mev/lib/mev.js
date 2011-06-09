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
		EventEmitter = require('events').EventEmitter;

function Mev(mmodule, input, output, debug) {
	
  var that = this,
      outd,
      ind;
      
  that.mm = mmodule;

  // Open the output file in append mode
  outd = fs.openSync(output, 'a');
  ind = input;

	// Read the input file
	that.readData = function(){
		logger('reading ', ind);
		fs.readFile(ind, 'utf8', function(err, data){
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
    fs.writeSync(outd, res.key + ', ' + res.value + '\n')
    that.emit('finish', res);
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
	
	that.stop = function(){
    // Only shutdown if requests are all handled
    logger('deregistering events');
    that.mm.removeAllListeners('data');
    that.mm.removeAllListeners('request');
    that.mm.removeAllListeners('result');
    that.mm.removeAllListeners('done');
    if(outd) {
      logger('closing file');
      fs.closeSync(outd);
    }
    logger('shut down');
    that.emit('shutdown');
	};
}

// Extend EventEmitter
Mev.prototype = new EventEmitter;

module.exports = Mev;
