var assert = require('assert'),
    should = require('should'),
    util = require('util'),
		Mev = require('../lib/mev'),
    fs = require('fs'),
    net = require('net'),
		Dummy = require('../lib/dummy');

module.exports = {
		
  'test data input basic': function(){
    var i, o, so, si, id, od;
    var si = net.createServer(function(sock){ i = sock });
    var so = net.createServer(function(sock){ o = sock });
    si.listen('/tmp/inbasic.sock');
    id = net.createConnection('/tmp/inbasic.sock');
    so.listen('/tmp/outbasic.sock');
    od = net.createConnection('/tmp/outbasic.sock');
	  var dummy = new Dummy('dummy'),
	      mev = new Mev(dummy, i, o);
	  dummy.on('data', function(data){
      data.should.eql({ data:1 });
    });
    mev.dataInput("1");
    mev.stop();
  },
  // 
  // 'test read data': function(){
  //   var i = net.createConnection('/tmp/inread.sock');
  //   var o = net.createConnection('/tmp/outread.sock');
  //    var dummy = new Dummy('dummy'),
  //        mev = new Mev (dummy, i, o);
  //    dummy.on('data', function(data){
  //     data.should.be.a('object').and.have.ownProperty('data');
  //     data.should.not.eql({ data:'#' });
  //     data.should.not.eql( undefined );
  //   });
  //   fs.readFile(__dirname + '/data/dummyinput.lst', function(err, data){
  //     i.write(data);
  //   });
  //   mev.stop()
  // },
  // 
  // 'test event registration': function(){
  //   var i = net.createConnection('/tmp/inev.sock');
  //   var o = net.createConnection('/tmp/outev.sock');
  //    var dummy = new Dummy('dummy'),
  //        mev = new Mev (dummy, i, o);
  //   mev.regEvents();
  //   dummy.listeners('data')[0].should.be.a('function');
  //   dummy.listeners('request')[0].should.be.a('function');
  //   dummy.listeners('result')[0].should.be.a('function');
  //   dummy.listeners('done')[0].should.be.a('function');
  //   mev.stop()
  // },
  // 
  // 'test pass through': function(){
  //   var i = net.createConnection('/tmp/inpass.sock');
  //   var o = net.createConnection('/tmp/outpass.sock');
  //    var dummy = new Dummy('dummy'),
  //        mev = new Mev (dummy, i, o);
  //   mev.regEvents();
  //   mev.on('done', function(res){
  //     res.should.eql('1');
  //   });
  //   mev.dataInput('1');
  //   mev.stop()
  // },
  // 
  // 'test output': function(){
  //   var i = net.createConnection('/tmp/inout.sock');
  //   var o = net.createConnection('/tmp/outout.sock');
  //   var dummy = new Dummy('dummy'),
  //       mev = new Mev(dummy, i, o);
  //   o.on('data', function(data){
  //     d = data.split(' ')
  //     d[0].trim().should.be.eql(res.key)
  //     d[1].trim().should.be.eql(res.value)      
  //   });
  //   mev.finishRes({ 'key': '1', 'value':'1' });
  // }
}
