System.register(['aurelia-dependency-injection', 'aurelia-templating'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_dependency_injection_1, aurelia_templating_1;
    var Compiler;
    return {
        setters:[
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            }],
        execute: function() {
            Compiler = (function () {
                function Compiler(viewCompiler, resources, container, viewEngine) {
                    this.viewCompiler = viewCompiler;
                    this.resources = resources;
                    this.container = container;
                    this.viewEngine = viewEngine;
                }
                Compiler.prototype.compile = function (element, fragment, context, overrideContext) {
                    if (overrideContext === void 0) { overrideContext = undefined; }
                    element.classList.remove('au-target');
                    var view = this.viewCompiler.compile(fragment, this.resources).create(this.container);
                    var viewSlot = new aurelia_templating_1.ViewSlot(element, true, undefined);
                    viewSlot.add(view);
                    viewSlot.bind(context, overrideContext);
                    viewSlot.attached();
                    return viewSlot;
                };
                Compiler.prototype.compileTemplate = function (element, templateUrl, ctx) {
                    var _this = this;
                    return this.viewEngine.loadViewFactory(templateUrl).then(function (x) {
                        var view = x.create(_this.container);
                        var viewSlot = new aurelia_templating_1.ViewSlot(element, true, undefined);
                        viewSlot.add(view);
                        viewSlot.bind(ctx, undefined);
                        viewSlot.attached();
                        return viewSlot;
                    });
                };
                Compiler = __decorate([
                    aurelia_dependency_injection_1.inject(aurelia_templating_1.ViewCompiler, aurelia_templating_1.ViewResources, aurelia_dependency_injection_1.Container, aurelia_templating_1.ViewEngine)
                ], Compiler);
                return Compiler;
            }());
            exports_1("Compiler", Compiler);
        }
    }
});
