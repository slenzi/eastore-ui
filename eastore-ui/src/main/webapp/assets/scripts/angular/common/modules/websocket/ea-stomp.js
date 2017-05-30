/*
Angular module for STOMP messaging over web sockets
-sal
*/

(function () {

	'use strict';

	var eaStompModule;

	// create module
	eaStompModule = angular.module('ea-stomp-module', []);

	// set default options
	eaStompModule.value('eaStompOptions', {
		sockJsUrl: '',
		sockJsOptions: {},
		sockJsProtocols: { 
			protocols_whitelist: [
			      "websocket", "xhr-streaming", "xdr-streaming", "xhr-polling", 
			      "xdr-polling", "iframe-htmlfile", "iframe-eventsource", "iframe-xhr-polling"]
		},
		stompHeaders: {
			//login: 'mylogin',
			//passcode: 'mypasscode',
			//// additional header
			//'client-id': 'my-client-id'			
		},
		connection: {
			sock: null,
			stomp: null
		},
		debug: function(str){
			console.log("EAStomp: " + str);
		}
	})
	.factory('EAStomp', ['eaStompOptions', '$log',

	    /**
	     * Factory method which returns EAStomp object prototype.
	     */
	    function eaStompFactory(eaStompOptions, $log){
		
			var userOptions;
		
			/**
			 * Create instance of EAStomp from object prototype.
			 *
			 * @param {Object} options
			 * @constructor
			 */
			function EAStomp(options){
				
				userOptions = options;
				
				_doInit(this, userOptions);
				
			};
			
			/**
			 * Initialize everything
			 */
			function _doInit(eaStomp, options){
				
				var defaultOptions = angular.copy(eaStompOptions);

				angular.extend(eaStomp, defaultOptions, options);
				
				eaStomp.connection.sock  = new SockJS(eaStomp.sockJsUrl); // url, protocols, options
				eaStomp.connection.stomp = Stomp.over(eaStomp.connection.sock);
				eaStomp.connection.stomp.debug = eaStomp.debug;
				eaStomp.connection.sock.onclose = _onSocketClose;
				
			}
			
			/**
			 * Handle sockjs close
			 */
			function _onSocketClose(){
				$log.debug('_onSocketClose()');
				_doSocketReconnect();
			}
			
			/**
			 *  Reinitialize and reconnect.
			 */
			function _doSocketReconnect(){
				$log.debug('_doSocketReconnect()');
				setTimeout(_doInit(this, userOptions), 10000);
			}			
			
			/**
			 * Check if object is a function
			 */
			function isFunction(object){
				return object && typeof object === 'function';
			};
			
			/**
			 * Opens the Stomp (and websockt) connection.
			 *
			 * @param {function} connectCallback
			 */
			EAStomp.prototype.connect = function(connectCallback, connectErrorCallback){
				
				if(!isFunction(connectCallback)){
					$log.error('connectCallback function does not exist, or is not a function.');
					return;
				}
				if(!isFunction(connectErrorCallback)){
					$log.error('connectErrorCallback function does not exist, or is not a function.');
					return;
				}				

				this.connection.stomp.connect(
					this.stompHeaders, connectCallback, connectErrorCallback
				);					
				
			};
			
			/**
			 * Subscribe to a Stomp destination
			 *
			 * @param {string} destination
			 * @param {function} messageCallback
			 */
			EAStomp.prototype.subscribe = function(destination, messageCallback){
				
				if(!isFunction(messageCallback)){
					$log.error('messageCallback function does not exist, or is not a function.');
					return;
				}

				var subscription = this.connection.stomp.subscribe(
					destination, messageCallback
				);
				
				return subscription;
				
			};
			
			/**
			 * Send Stomp message.
			 *
			 * examples:
			 * client.send("/queue/test", {priority: 9}, "Hello, STOMP");
			 * client.send(destination, {}, body);
			 *
			 * @param {string} destination
			 * @param {object} headers
			 * @param {String} body
			 */
			EAStomp.prototype.send = function(destination, headers, body){
				
				this.connection.stomp.send(destination, headers, body);
				
			};
			
			/**
			 * Set the stomp debug function
			 *
			 * @param {function} debugFunc
			 */
			EAStomp.prototype.setDebug = function(debugFunc){
				
				if(!isFunction(debugFunc)){
					$log.error('debugFunc function does not exist, or is not a function.');
					return;
				}
				this.debug = debugFunc;
				this.connection.stomp.debug = this.debug;
				
			};
			
			return EAStomp;
			
		}
		
	]);

	return eaStompModule;

})();	