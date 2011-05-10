/* Dummy module for Mev
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Does not really provide anything, just for testing as well as specify the 
 * Struktur of a module 
 * 
 * This is part of the iStrukta Project for internet analyzation
 */

var mev = require(__dirname + '/mev'),
	EventEmitter = require('events').EventEmitter;

function Dummy(id) {
		
	// Setup
  var done = false,
      that = this;

	that._mev = null;
	that.id = id;
	
	// Write the result somewhere or just throw back
	var finishRes = function(result){
		that.emit('done', result);
	};
	
	// Read input from a file
	that.readInput = function(indata){
		var data = { data : indata };
		that.emit('data', data);
	};
	
	// Generate requests from data 
	that.genReq = function(data){
		var request = { request : data };
		that.emit('request', request);
	};
	
	// Run a given Request
	that.runReq = function(req){
		var result = { result : req.request };
		that.emit('result', result);
	};
	
	// Handle the result returned form a request
	that.handleRes = function(result){
		if(done) {
      done = false;
			finishRes(result.result);
		} else {
			var data = { data: result.result };
      done = true;
			that.emit('data', data);‚
		}
	};
};

// Extend EventEmitter‚
Dummy.prototype = new EventEmitter;

// Export
module.exports = Dummy;
