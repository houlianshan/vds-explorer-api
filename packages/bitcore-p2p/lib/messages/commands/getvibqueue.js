'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib');
var BufferUtil = bitcore.util.buffer;

/**
 * A message in response to a version message.
 * @extends Message
 * @constructor
 */
function GetVibQueueMessage(arg, options) {
  Message.call(this, options);
  this.command = 'getvibqueue';
}
inherits(GetVibQueueMessage, Message);

GetVibQueueMessage.prototype.setPayload = function() {};

GetVibQueueMessage.prototype.getPayload = function() {
  return BufferUtil.EMPTY_BUFFER;
};

module.exports = GetVibQueueMessage;
