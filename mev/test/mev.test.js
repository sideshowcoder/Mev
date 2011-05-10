var assert = require('assert'),
    should = require('should'),
    util = require('util'),
		Mev = require('../lib/mev'),
	  redis = require('redis'),
    fs = require('fs'),
		Dummy = require('../lib/dummy');

module.exports = {
	
	'test redis accessible and empty': function(){
	  var dummy = new Dummy('dummy'),
	      mev = new Mev(dummy, __dirname + '/data/dummyinput.lst');
	  mev.db.keys('*', function(err, status){
      assert.isNull(err);
      status.should.be.instanceof(Array).and.be.empty;
	  });
    mev.db.set('a', 'a', function(err, status){
      assert.isNull(err);
      status.should.be.a('string').and.eql('OK');
    });
    mev.db.get('a', function(err, status){
      assert.isNull(err);
      status.should.be.a('string').and.eql('a');
      mev.stop();
    });
  },
	
  'test data input basic': function(){
	  var dummy = new Dummy('dummy'),
	      mev = new Mev (dummy, __dirname + '/data/dummyinput.lst');
	  dummy.on('data', function(data){
      data.should.eql({'data':1});
    });
    mev.dataInput("1");
    mev.stop();
  },

  'test read data': function(){
	  var dummy = new Dummy('dummy'),
	      mev = new Mev (dummy, __dirname + '/data/dummyinput.lst');
	  dummy.on('data', function(data){
      data.should.be.a('object').and.have.ownProperty('data');
      data.should.not.eql({ data:'#' });
      data.should.not.be.empty;
    });
    mev.readData();
    mev.stop()
  },

  'test event registration': function(){
	  var dummy = new Dummy('dummy'),
	      mev = new Mev (dummy, __dirname + '/data/dummyinput.lst');
    mev.regEvents();
    dummy.listeners('data')[0].should.be.a('function');
    dummy.listeners('request')[0].should.be.a('function');
    dummy.listeners('result')[0].should.be.a('function');
    dummy.listeners('done')[0].should.be.a('function');
    mev.stop()
  },

  'test pass through': function(){
	  var dummy = new Dummy('dummy'),
	      mev = new Mev (dummy, __dirname + '/data/dummyinput.lst');
    mev.regEvents();
    mev.on('done', function(res){
      res.should.eql('1');
    });
    mev.dataInput('1');
    mev.stop()
  },

  'test fileoutput': function(){
    var dummy = new Dummy('dummy'),
        mev = new Mev(dummy, __dirname + '/data/dummyinput.lst', false, false, __dirname + '/testoutput.out');
    mev.finishRes({ 'key': '1', 'value':'1' });
    mev.on('finish', function(res){
      fs.readFile(__dirname + '/testoutput.out', 'utf8', function(err, data){
        if(err) throw err;
        d = data.split(' ')
        d[0].trim().should.be.eql(res.key)
        d[1].trim().should.be.eql(res.value)
        fs.unlink(__dirname + '/testoutput.out', function(err){
          if(err) throw err;
        })
      })
    })
  }
}
