'use strict';

var _ = require('lodash');
var BN = require('../crypto/bn');
var buffer = require('buffer');
var bufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');
var BufferWriter = require('../encoding/bufferwriter');
var $ = require('../util/preconditions');
var errors = require('../errors');

var MAX_SAFE_INTEGER = 0x1fffffffffffff;

function OutputDescription(args) {
  if (!(this instanceof OutputDescription)) {
    return new OutputDescription(args);
  }
  if (_.isObject(args)) {
    this.cv = args.cv;
    this.cm = args.cm;
    this.ephemeralKey = args.ephemeralKey;
    this.encCiphertext = args.encCiphertext;
    this.outCiphertext = args.outCiphertext;
    this.zkproof = args.zkproof;
  } else {
    throw new TypeError('Unrecognized argument for OutputDescription');
  }
}



OutputDescription.fromObject = function(data) {
  return new OutputDescription(data);
};


OutputDescription.fromBufferReader = function(br) {
  var obj = {};
  obj.cv = br.read(32);
  obj.cm=br.read(32);
  obj.ephemeralKey=br.read(32);
  obj.encCiphertext=br.read(580);
  obj.outCiphertext=br.read(80);
  obj.zkproof=br.read(192);
  return new OutputDescription(obj);
};

OutputDescription.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.write(this.cv);
  writer.write(this.cm);
  writer.write(this.ephemeralKey);
  writer.write(this.encCiphertext);
  writer.write(this.outCiphertext);
  writer.write(this.zkproof);
  return writer;
};


module.exports = OutputDescription;
