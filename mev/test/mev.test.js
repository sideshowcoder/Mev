var assert = require('assert'),
    should = require('should'),
    util = require('util'),
		Mev = require('../lib/mev'),
    fs = require('fs'),
    net = require('net'),
		Dummy = require('../lib/dummy');

module.exports = {
		
  'test data input file': function(){    
    var dummy = new Dummy('dummy'),
	      mev = new Mev(dummy, __dirname + '/test.in', __dirname + '/test.out', {file: true});
	  mev.init();
	  dummy.on('data', function(data){
	    data.should.eql({ data:1 });
    });
    mev.dataInput('1');
  },
  
  'test data input socket': function(){
    var sin = net.createServer();
    sin.listen('/tmp/mevinput.sock', function(){      
      var dummy = new Dummy('Dummy'),
          mev = new Mev(dummy, '/tmp/mevinput.sock', '/tmp/mevoutput.sock');
      mev.init();    
      dummy.on('data', function(data){
        data.should.eql({ data: 1});
      });
      mev.dataInput('1');
    });
  },
  
  'test read file': function(){
    var dummy = new Dummy('dummy'),
        mev = new Mev (dummy, __dirname + '/data/dummyinput.lst', __dirname + '/test.out', {file: true});
    mev.init();
    dummy.on('data', function(data){
      data.should.be.a('object').and.have.ownProperty('data');
      data.should.not.eql({ data:'#' });
      data.should.not.eql( undefined );
    });
  },
  
  'test read socket': function(){
    var sin = net.createServer(function(socket){
      fs.readFile(__dirname + '/data/dummyinput.lst', 'utf8', function(err, data){
        if(err) throw err;
        socket.write(data);
      });    
    });
    sin.listen('/tmp/mevin.sock', function(){      
      var dummy = new Dummy('dummy'),
          mev = new Mev(dummy, '/tmp/mevin.sock', '/tmp/mevout.sock');
      mev.init();
      dummy.on('data', function(data){
        data.should.be.a('object').and.have.ownProperty('data');
        data.should.not.eql({ data:'#' });
        data.should.not.eql( undefined );
      });
    });  
  },

  'test output file': function(){
    var dummy = new Dummy('dummy'),
        mev = new Mev(dummy, __dirname + '/test.in', __dirname + '/data/testfile.out', {file: true});
    mev.init();
    mev.on('finish', function(res){
      fs.readFile(__dirname + '/data/testfile.out', 'utf8', function(err, data){
        if(err) throw err;
        d = data.split(',')
        d[0].trim().should.be.eql(1)
        d[1].trim().should.be.eql(1)
        fs.unlink(__dirname + '/data/testfile.out', function(err){
          if(err) throw err;
        })
      })
    })
    mev.finishRes({ key: 1, value:1 });
  },
  
  'test output socket': function(){
    var sin = net.createServer();
    sin.listen('/tmp/mevin2.sock', function(){
      var dummy = new Dummy('dummy'),
          mev = new Mev(dummy, '/tmp/mevin2.sock', '/tmp/mevout2.sock');
      mev.init();
      mev.on('output', function(){
        var res = net.createConnection('/tmp/mevout2.sock');
        res.on('connect', function(){        
          res.setEncoding('utf8');
          res.on('data', function(data){
            d = data.split(',');
            d[0].trim().should.be.eql(1);
            d[1].trim().should.be.eql(1);       
          })
          setTimeout(function(){
            mev.finishRes({ key: 1, value: 1 });
          }, 1000);
        })
      })
    })
  },
  
  'test event registration': function(){
     var dummy = new Dummy('dummy'),
         mev = new Mev (dummy, __dirname + '/test.in', __dirname + '/test.out', {file: true});
    mev.init();
    dummy.listeners('data')[0].should.be.a('function');
    dummy.listeners('request')[0].should.be.a('function');
    dummy.listeners('result')[0].should.be.a('function');
    dummy.listeners('done')[0].should.be.a('function');
    mev.stop()
  },
  
  'test pass through': function(){
    var dummy = new Dummy('dummy'),
        mev = new Mev (dummy, __dirname + '/test.in', __dirname + '/test.out', {file: true});
    mev.init();
    mev.on('done', function(res){
      res.should.eql('1');
    });
    mev.dataInput('1');
  }
  
}
