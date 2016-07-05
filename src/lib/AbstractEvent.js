"use strict";
var _callListenerResult = 0 /* NONE */;
var AbstractEvent = (function()
{
	function AbstractEvent( type, bubbles, cancelable, target, setTimeStamp )
	{
		var _this = this;
		if( bubbles === void 0 )
		{ bubbles = false; }
		if( cancelable === void 0 )
		{ cancelable = false; }
		if( target === void 0 )
		{ target = null; }
		if( setTimeStamp === void 0 )
		{ setTimeStamp = false; }
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
		this.target = target;
		this.currentTarget = null;
		this.eventPhase = 0 /* NONE */;
		this._defaultPrevented = false;
		this.callListener = function( listener )
		{
			_callListenerResult = 0 /* NONE */;
			listener.call( null, _this );
			return _callListenerResult;
		};
		this.timeStamp = setTimeStamp ? Date.now() : 0;
	}

	Object.defineProperty( AbstractEvent.prototype, "defaultPrevented", {
		get: function()
		{
			return this._defaultPrevented;
		},
		enumerable: true,
		configurable: true
	} );
	AbstractEvent.prototype.stopPropagation = function()
	{
		if( _callListenerResult < 1 /* PROPAGATION_STOPPED */ )
		{
			_callListenerResult = 1 /* PROPAGATION_STOPPED */;
		}
	};
	AbstractEvent.prototype.stopImmediatePropagation = function()
	{
		_callListenerResult = 2 /* IMMEDIATE_PROPAGATION_STOPPED */;
	};
	AbstractEvent.prototype.preventDefault = function()
	{
		if( this.cancelable )
		{
			this._defaultPrevented = true;
		}
		else
		{
		}
	};
	return AbstractEvent;
}());
Object.defineProperty( exports, "__esModule", {value: true} );
exports.default = AbstractEvent;
