"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var aurelia_binding_1 = require('aurelia-binding');
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_templating_1 = require('aurelia-templating');
var AureliaUtils = (function () {
    function AureliaUtils(observerLocator) {
        this.observerLocator = observerLocator;
    }
    AureliaUtils.prototype.observe = function (context, property, callback) {
        var _this = this;
        this.observerLocator.getObserver(context, property).subscribe(callback);
        return function () {
            _this.observerLocator.getObserver(context, property).unsubscribe(callback);
        };
    };
    AureliaUtils.bindable = function (mode) {
        if (mode === void 0) { mode = undefined; }
        return function (type, property) {
            // todo: attribute
            return aurelia_templating_1.bindable({
                name: property,
                defaultBindingMode: mode
            })(type, property);
        };
    };
    AureliaUtils = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_binding_1.ObserverLocator)
    ], AureliaUtils);
    return AureliaUtils;
}());
exports.AureliaUtils = AureliaUtils;
