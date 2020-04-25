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

function SpendDescription(args) {
  if (!(this instanceof SpendDescription)) {
    return new SpendDescription(args);
  }
  if (_.isObject(args)) {
    this.cv = args.cv;
    this.anchor = args.anchor;
    this.nullifier = args.nullifier;
    this.rk = args.rk;
    this.grothProof = args.grothProof;
    this.spendAuthSig_t = args.spendAuthSig_t;
  } else {
    throw new TypeError('Unrecognized argument for SpendDescription');
  }
}



SpendDescription.fromObject = function(data) {
  return new SpendDescription(data);
};


SpendDescription.fromBufferReader = function(br) {
  var obj = {};
  obj.cv = br.read(32);
  obj.anchor=br.read(32);
  obj.nullifier=br.read(32);
  obj.rk=br.read(32);
  obj.grothProof=br.read(192);
  obj.spendAuthSig_t=br.read(64);
  return new SpendDescription(obj);
};

SpendDescription.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.write(this.cv);
  writer.write(this.anchor);
  writer.write(this.nullifier);
  writer.write(this.rk);
  writer.write(this.grothProof);
  writer.write(this.spendAuthSig_t);
  return writer;
};


module.exports = SpendDescription;
