System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PubSub;
    return {
        setters:[],
        execute: function() {
            PubSub = (function () {
                function PubSub() {
                    this._subscribers = {};
                }
                PubSub.prototype.publish = function (name, payload) {
                    var subscribers = this._subscribers[name];
                    if (!subscribers) {
                        return;
                    }
                    subscribers.forEach(function (x) { return x(payload); });
                };
                PubSub.prototype.subscribe = function (name, callback) {
                    var _this = this;
                    this._subscribers[name] = this._subscribers[name] || [];
                    this._subscribers[name].push(callback);
                    return function () { _this.unsubscribe(name, callback); };
                };
                PubSub.prototype.unsubscribe = function (name, callback) {
                    var subscribers = this._subscribers[name];
                    if (!subscribers) {
                        return;
                    }
                    var index = this._subscribers[name].indexOf(callback);
                    while (index !== -1) {
                        this._subscribers[name].splice(index, 1);
                        index = this._subscribers[name].indexOf(callback);
                    }
                };
                return PubSub;
            }());
            exports_1("PubSub", PubSub);
        }
    }
});
