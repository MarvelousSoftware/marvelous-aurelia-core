"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_binding_1 = require('aurelia-binding');
var utils_1 = require('./utils');
var OptionsReaderFactory = (function () {
    function OptionsReaderFactory(_bindingEngine) {
        this._bindingEngine = _bindingEngine;
    }
    OptionsReaderFactory.prototype.create = function (bindingContext, element, codeBasedOptions) {
        if (codeBasedOptions === void 0) { codeBasedOptions = undefined; }
        return new OptionsReader(element, {
            bindingContext: bindingContext,
            bindingEngine: this._bindingEngine,
            codeBasedOptions: codeBasedOptions
        });
    };
    OptionsReaderFactory = __decorate([
        aurelia_dependency_injection_1.inject(aurelia_binding_1.BindingEngine)
    ], OptionsReaderFactory);
    return OptionsReaderFactory;
}());
exports.OptionsReaderFactory = OptionsReaderFactory;
var OptionsReader = (function () {
    function OptionsReader(_element, _resources) {
        this._element = _element;
        this._resources = _resources;
    }
    OptionsReader.prototype.get = function (selector) {
        return getReaderBySelector(selector, this._element, this._resources);
    };
    OptionsReader.prototype.getAll = function (selector) {
        return getAllReadersBySelector(selector, this._element, this._resources);
    };
    return OptionsReader;
}());
exports.OptionsReader = OptionsReader;
var CodeBasedPropertyReader = (function () {
    function CodeBasedPropertyReader(_propertyName, element, _resources) {
        this._propertyName = _propertyName;
        this.element = element;
        this._resources = _resources;
    }
    Object.defineProperty(CodeBasedPropertyReader.prototype, "defined", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeBasedPropertyReader.prototype, "name", {
        get: function () { return this._propertyName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeBasedPropertyReader.prototype, "truthy", {
        get: function () { return !!this.evaluate(); },
        enumerable: true,
        configurable: true
    });
    CodeBasedPropertyReader.prototype.get = function (selector) {
        return getReaderBySelector(selector, this.element, this._createInnerResources());
    };
    CodeBasedPropertyReader.prototype.getAll = function (selector) {
        return getAllReadersBySelector(selector, this.element, this._createInnerResources());
    };
    CodeBasedPropertyReader.prototype.getAllProperties = function () {
        return getAllProperties(this.element, this._createInnerResources());
    };
    CodeBasedPropertyReader.prototype._createInnerResources = function () {
        return {
            bindingContext: this._resources.bindingContext,
            bindingEngine: this._resources.bindingEngine,
            codeBasedOptions: this._resources.codeBasedOptions[this._propertyName],
            parent: this._resources
        };
    };
    CodeBasedPropertyReader.prototype.evaluate = function (defaultValue) {
        var result = this._resources.codeBasedOptions[this._propertyName];
        return result === undefined ? defaultValue : result;
    };
    return CodeBasedPropertyReader;
}());
exports.CodeBasedPropertyReader = CodeBasedPropertyReader;
var CodeBasedArrayItemReader = (function () {
    function CodeBasedArrayItemReader(_item, element, _resources) {
        this._item = _item;
        this.element = element;
        this._resources = _resources;
    }
    Object.defineProperty(CodeBasedArrayItemReader.prototype, "defined", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeBasedArrayItemReader.prototype, "name", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeBasedArrayItemReader.prototype, "truthy", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    CodeBasedArrayItemReader.prototype.get = function (selector) {
        return getReaderBySelector(selector, this.element, this._createInnerResources());
    };
    CodeBasedArrayItemReader.prototype.getAll = function (selector) {
        return getAllReadersBySelector(selector, this.element, this._createInnerResources());
    };
    CodeBasedArrayItemReader.prototype.getAllProperties = function () {
        return getAllProperties(this.element, this._createInnerResources());
    };
    CodeBasedArrayItemReader.prototype._createInnerResources = function () {
        return {
            bindingContext: this._resources.bindingContext,
            bindingEngine: this._resources.bindingEngine,
            codeBasedOptions: this._item,
            parent: this._resources
        };
    };
    CodeBasedArrayItemReader.prototype.evaluate = function () {
        return this._item;
    };
    return CodeBasedArrayItemReader;
}());
exports.CodeBasedArrayItemReader = CodeBasedArrayItemReader;
var ElementReader = (function () {
    function ElementReader(element, _resources) {
        this.element = element;
        this._resources = _resources;
    }
    Object.defineProperty(ElementReader.prototype, "defined", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementReader.prototype, "name", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementReader.prototype, "truthy", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    ElementReader.prototype.get = function (selector) {
        return getReaderBySelector(selector, this.element, this._resources);
    };
    ElementReader.prototype.getAll = function (selector) {
        return getAllReadersBySelector(selector, this.element, this._resources);
    };
    ElementReader.prototype.getAllProperties = function () {
        return getAllProperties(this.element, {
            bindingContext: this._resources.bindingContext,
            bindingEngine: this._resources.bindingEngine,
            codeBasedOptions: undefined,
            parent: this._resources
        });
    };
    ElementReader.prototype.evaluate = function () {
        throw new Error(this.element.tagName + " cannot be evaluated, because it is a node. Only attributes are evaluable.");
    };
    return ElementReader;
}());
exports.ElementReader = ElementReader;
var AttributeReader = (function () {
    function AttributeReader(name, _value, _isExpression, _resources) {
        this.name = name;
        this._value = _value;
        this._isExpression = _isExpression;
        this._resources = _resources;
    }
    Object.defineProperty(AttributeReader.prototype, "defined", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeReader.prototype, "element", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeReader.prototype, "truthy", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    AttributeReader.prototype.get = function (selector) {
        throw new Error('Attribute cannot have any nested options.');
    };
    AttributeReader.prototype.getAll = function (selector) {
        throw new Error('Attribute cannot have any nested options.');
    };
    AttributeReader.prototype.getAllProperties = function () {
        throw new Error('Attribute cannot have any property.');
    };
    AttributeReader.prototype.evaluate = function (defaultValue) {
        if (!this._isExpression) {
            return this._value;
        }
        var result = this._resources.bindingEngine.parseExpression(this._value).evaluate({
            bindingContext: this._resources.bindingContext,
            overrideContext: undefined
        }, undefined);
        return result === undefined ? defaultValue : result;
    };
    return AttributeReader;
}());
exports.AttributeReader = AttributeReader;
var UndefinedElementReader = (function () {
    function UndefinedElementReader() {
    }
    Object.defineProperty(UndefinedElementReader.prototype, "defined", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UndefinedElementReader.prototype, "name", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UndefinedElementReader.prototype, "element", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UndefinedElementReader.prototype, "truthy", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    UndefinedElementReader.prototype.get = function (selector) {
        return this;
    };
    UndefinedElementReader.prototype.getAll = function (selector) {
        return [];
    };
    UndefinedElementReader.prototype.getAllProperties = function () {
        return [];
    };
    UndefinedElementReader.prototype.evaluate = function (defaultValue) {
        return defaultValue;
    };
    return UndefinedElementReader;
}());
exports.UndefinedElementReader = UndefinedElementReader;
function getReaderBySelector(selector, element, resources) {
    if (!selector) {
        throw new Error("Empty selector for " + element.tagName + " element.");
    }
    var names = selector.split(' ').map(function (x) { return x.trim(); });
    var codeReader = getReaderFromCode(names, element, resources);
    if (codeReader) {
        return codeReader;
    }
    return getReaderFromDom(names, element, {
        bindingContext: resources.bindingContext,
        bindingEngine: resources.bindingEngine,
        codeBasedOptions: undefined,
        parent: resources
    });
}
function getReaderFromCode(properties, element, resources) {
    if (!resources.codeBasedOptions) {
        return undefined;
    }
    var propertyIndex = 0;
    var currentPropertyName;
    var currentOption = resources.codeBasedOptions;
    var parentOption;
    while (propertyIndex < properties.length) {
        currentPropertyName = utils_1.Utils.convertFromDashToLowerCamelCaseNotation(properties[propertyIndex]);
        if (typeof currentOption !== 'object' || (currentPropertyName in currentOption) === false) {
            return undefined;
        }
        parentOption = currentOption;
        currentOption = currentOption[currentPropertyName];
        propertyIndex++;
    }
    var currentElement;
    if (element) {
        currentElement = element.querySelector(properties.join(' '));
    }
    return new CodeBasedPropertyReader(currentPropertyName, currentElement, {
        bindingContext: resources.bindingContext,
        bindingEngine: resources.bindingEngine,
        codeBasedOptions: parentOption,
        parent: resources
    });
}
function getReaderFromDom(nodeNames, element, resources) {
    if (!element) {
        return new UndefinedElementReader();
    }
    var currentNode = element;
    var prevNode;
    for (var i = 0; i < nodeNames.length; i++) {
        var nodeName = nodeNames[i];
        prevNode = currentNode;
        currentNode = currentNode.querySelector(nodeName);
        if (!currentNode) {
            // if last element from selector then it might be an attribute
            // from previous node, e.g. `components pagination --->size<---`
            var attribute = getAttribute(prevNode, nodeName);
            if (i === nodeNames.length - 1 && attribute) {
                return new AttributeReader(nodeName, attribute.value, attribute.isExpression, resources);
            }
            return new UndefinedElementReader();
        }
    }
    return new ElementReader(currentNode, resources);
}
function getAllReadersBySelector(selector, element, resources) {
    if (!selector) {
        throw new Error("Empty selector for " + element.tagName + " element.");
    }
    var names = selector.split(' ').map(function (x) { return x.trim(); });
    var codeReaders = getAllReadersFromCode(names, element, resources);
    if (codeReaders) {
        return codeReaders;
    }
    return getAllReadersFromDom(names, element, resources) || [];
}
function getAllReadersFromCode(properties, element, resources) {
    var all = [];
    if (!resources.codeBasedOptions) {
        return undefined;
    }
    var propertyIndex = 0;
    var currentPropertyName;
    var currentOption = resources.codeBasedOptions;
    var parentOption = currentOption;
    // in case of code selectors last property name is not relevant, e.g.
    // dom: <m-component><foo><bar value="1"></bar></foo></m-component>
    // code: { foo: [value: '1'] }
    // that's why `properties.length - 1`
    while (propertyIndex < properties.length - 1) {
        currentPropertyName = utils_1.Utils.convertFromDashToLowerCamelCaseNotation(properties[propertyIndex]);
        if (typeof currentOption !== 'object' || (currentPropertyName in currentOption) === false) {
            return undefined;
        }
        parentOption = currentOption;
        currentOption = currentOption[currentPropertyName];
        propertyIndex++;
    }
    if (currentOption instanceof Array === false) {
        return undefined;
    }
    var options = currentOption;
    options.forEach(function (option) {
        all.push(new CodeBasedArrayItemReader(option, undefined, {
            bindingContext: resources.bindingContext,
            bindingEngine: resources.bindingEngine,
            codeBasedOptions: parentOption,
            parent: resources
        }));
    });
    return all;
}
function getAllReadersFromDom(nodeNames, element, resources) {
    var all = [];
    var currentNode = element;
    for (var i = 0; i < nodeNames.length - 1; i++) {
        var nodeName_1 = nodeNames[i];
        currentNode = currentNode.querySelector(nodeName_1);
        if (!currentNode) {
            break;
        }
    }
    var parentNode = currentNode;
    if (!parentNode) {
        return undefined;
    }
    var nodeName = nodeNames[nodeNames.length - 1];
    var elements = parentNode.querySelectorAll(nodeName);
    for (var i = 0; i < elements.length; i++) {
        var element_1 = elements[i];
        all.push(new ElementReader(element_1, resources));
    }
    return all;
}
function getAllProperties(element, resources) {
    var all = [];
    if (resources.codeBasedOptions) {
        for (var name_1 in resources.codeBasedOptions) {
            all.push(new CodeBasedPropertyReader(name_1, element, resources));
        }
    }
    else if (element) {
        var attributes = element.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var name_2 = attributes[i].name;
            var attribute = getAttribute(element, name_2);
            all.push(new AttributeReader(attribute.name, attribute.value, attribute.isExpression, resources));
        }
    }
    return all;
}
function getAttribute(element, name) {
    if (!element) {
        return undefined;
    }
    var bind = '.bind';
    var oneTime = '.one-time';
    if (element.hasAttribute(name)) {
        var value_1 = element.getAttribute(name);
        var isExpression = false;
        var shortName = name;
        if (utils_1.Utils.endsWith(name, bind)) {
            isExpression = true;
            shortName = name.substr(0, name.length - bind.length);
        }
        else if (utils_1.Utils.endsWith(name, oneTime)) {
            isExpression = true;
            shortName = name.substr(0, name.length - oneTime.length);
        }
        return {
            name: shortName,
            value: isExpression === false && value_1 === '' ? true : value_1,
            isExpression: isExpression
        };
    }
    var value = element.getAttribute(name + bind) || element.getAttribute(name + oneTime);
    if (value !== null) {
        return {
            name: name,
            value: value,
            isExpression: true
        };
    }
    var isNotAllowedBinding = !!(element.getAttribute(name + '.one-way') || element.getAttribute(name + '.two-way'));
    if (isNotAllowedBinding) {
        throw new Error('one-way and two-way bindings are not allowed in the options definition.');
    }
    return undefined;
}
