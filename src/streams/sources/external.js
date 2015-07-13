// Fetches an image from an external URL

'use strict';

var stream, util, request;

stream  = require('stream');
util    = require('util');
request = require('request');

function contentLength(bufs){
  return bufs.reduce(function(sum, buf){
    return sum + buf.length;
  }, 0);
}

function External(image, key, prefix){
  /* jshint validthis:true */
  if (!(this instanceof External)){
    return new External(image, key, prefix);
  }
  stream.Readable.call(this, { objectMode : true });
  this.image = image;
  this.ended = false;
  this.key = key;
  this.prefix = prefix;
}

util.inherits(External, stream.Readable);

External.prototype._read = function(){
  var _this = this,
    url;
  if ( this.ended ){ return; }

  // pass through if there is an error on the image object
  if (this.image.isError()){
    this.ended = true;
    this.push(this.image);
    return this.push(null);
  }

  url = this.prefix + '/' + this.image.path;

  this.image.log.time(this.key);
  require('./util/fetch')(_this, url);
};


module.exports = External;