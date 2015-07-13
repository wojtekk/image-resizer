'use strict';

var stream, util, env;

stream  = require('stream');
util    = require('util');
env     = require('../../config/environment_vars');

function Facebook(image){
  /* jshint validthis:true */
  if (!(this instanceof Facebook)){
    return new Facebook(image);
  }
  stream.Readable.call(this, { objectMode : true });
  this.image = image;
  this.ended = false;
  this.key = 'facebook';

  // set the expiry value to the shorter value
  this.image.expiry = env.IMAGE_EXPIRY_SHORT;
}

util.inherits(Facebook, stream.Readable);

Facebook.prototype._read = function(){
  var _this = this,
      url;

  if ( this.ended ){ return; }

  // pass through if there is an error on the image object
  if (this.image.isError()){
    this.ended = true;
    this.push(this.image);
    return this.push(null);
  }

  var fbUid = this.image.image.split('.').slice(0,-1).join('.');

  url = 'https://graph.facebook.com/' + fbUid + '/picture?type=large';

  this.image.log.time(this.key);
  require('./util/fetch')(_this, url);
};


module.exports = Facebook;
