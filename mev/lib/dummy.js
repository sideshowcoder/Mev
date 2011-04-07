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
  var done = false;
	var self = this;
	this._mev = null;
	// Name the module to be addressed via Mev
	this.id = id;
  // console.log("Module Dummy initialized with id " + this.id);
	
	// Write the result somewhere or just throw back
	var finishRes = function(result){
		self.emit('done', result);
	};
	
	// Read input from a file
	this.readInput = function(indata){
		var data = { 'data' : indata };
		self.emit('data', data);
	};
	
	// Generate requests from data 
	this.genReq = function(data){
		var request = { 'request' : data['data'] };
		self.emit('request', request);
	};
	
	// Run a given Request
	this.runReq = function(req){
		var result = { 'result' : req['request'] };
		self.emit('result', result);
	};
	
	// Handle the result returned form a request
	this.handleRes = function(result){
		if(done) {
      done = false;
			finishRes(result['result']);
		} else {
			var data = { 'data' : result['result'] };
      done = true;
			self.emit('data', data);
		}
	};
};

// Extend EventEmitter
Dummy.prototype = new EventEmitter;

// Export
module.exports = Dummy;
