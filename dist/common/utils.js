System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var metadataKey, metadata, Debouncer, DomUtils, Utils;
    return {
        setters:[],
        execute: function() {
            exports_1("metadataKey", metadataKey = '__marvelous-metadata__');
            exports_1("metadata", metadata = {
                getOrCreate: function (obj) {
                    if (!!obj[metadataKey] === false) {
                        obj[metadataKey] = {};
                    }
                    return obj[metadataKey];
                }
            });
            Debouncer = (function () {
                function Debouncer(_debounceTime) {
                    this._debounceTime = _debounceTime;
                }
                Debouncer.prototype.do = function (action) {
                    if (this._debounceTime === undefined || this._debounceTime <= 0) {
                        action();
                    }
                    if (this._executingId !== undefined) {
                        clearTimeout(this._executingId);
                    }
                    this._executingId = setTimeout(function () {
                        action();
                    }, this._debounceTime);
                };
                return Debouncer;
            }());
            exports_1("Debouncer", Debouncer);
            DomUtils = (function () {
                function DomUtils() {
                }
                DomUtils.isVisible = function (element) {
                    return element.getClientRects().length > 0;
                };
                DomUtils.closest = function (element, tagName) {
                    while (element && element.tagName != tagName) {
                        element = element.parentElement;
                    }
                    return element;
                };
                DomUtils.offset = function (elem) {
                    var docElem, win, rect, doc;
                    rect = elem.getBoundingClientRect();
                    // Make sure element is not hidden (display: none) or disconnected
                    if (rect.width || rect.height || elem.getClientRects().length) {
                        doc = elem.ownerDocument;
                        docElem = doc.documentElement;
                        return {
                            top: rect.top + window.pageYOffset - docElem.clientTop,
                            left: rect.left + window.pageXOffset - docElem.clientLeft
                        };
                    }
                };
                DomUtils.isCursorOverElement = function (element, event) {
                    var cursor = {
                        left: event.pageX,
                        top: event.pageY
                    };
                    var border = DomUtils.offset(element);
                    border.right = border.left + element.clientWidth;
                    border.bottom = border.top + element.clientHeight;
                    return border.top <= cursor.top && border.bottom >= cursor.top &&
                        border.left <= cursor.left && border.right >= cursor.left;
                };
                DomUtils.clearInnerHtml = function (node) {
                    while (node.hasChildNodes()) {
                        node.removeChild(node.firstChild);
                    }
                };
                DomUtils.getCaretPosition = function (input) {
                    // Internet Explorer Caret Position (TextArea)
                    var caretPosition;
                    var doc = document;
                    if (doc.selection && doc.selection.createRange) {
                        var range = doc.selection.createRange();
                        var bookmark = range.getBookmark();
                        caretPosition = bookmark.charCodeAt(2) - 2;
                    }
                    else {
                        // Firefox Caret Position (TextArea)
                        if (input.setSelectionRange)
                            caretPosition = input.selectionStart;
                    }
                    return caretPosition;
                };
                DomUtils.setCaretPosition = function (element, caretPos) {
                    var elem = element;
                    if (elem != null) {
                        if (elem.createTextRange) {
                            var range = elem.createTextRange();
                            range.move('character', caretPos);
                            range.select();
                        }
                        else {
                            if (elem.selectionStart) {
                                elem.focus();
                                elem.setSelectionRange(caretPos, caretPos);
                            }
                            else
                                elem.focus();
                        }
                    }
                };
                DomUtils.addEventListener = function (element, event, listener) {
                    element.addEventListener(event, listener);
                    return function () {
                        element.removeEventListener(event, listener);
                    };
                };
                return DomUtils;
            }());
            exports_1("DomUtils", DomUtils);
            Utils = (function () {
                function Utils() {
                }
                Utils.noop = function () { };
                Utils.allDefined = function (obj) {
                    var params = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        params[_i - 1] = arguments[_i];
                    }
                    for (var i = 0; i < params.length; i++) {
                        if (obj[params[i]] === undefined) {
                            return false;
                        }
                    }
                    return true;
                };
                Utils.defer = function () {
                    // TODO: return appropriate type (generic one)!
                    var deferred;
                    var promise = new Promise(function (resolve, reject) {
                        deferred = {
                            resolve: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i - 0] = arguments[_i];
                                }
                                resolve.apply(this, args);
                            },
                            reject: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i - 0] = arguments[_i];
                                }
                                reject.apply(this, args);
                            }
                        };
                    });
                    deferred.promise = promise;
                    return deferred;
                };
                /**
                 * Returns promise if promise given or wraps the value with the auto resolved promise.
                 */
                Utils.when = function (valueOrPromise) {
                    var promise = valueOrPromise;
                    if (promise.then instanceof Function && promise['catch'] instanceof Function) {
                        return promise;
                    }
                    var deferred = Utils.defer();
                    deferred.resolve(valueOrPromise);
                    return deferred.promise;
                };
                Utils.firstDefined = function (defaultResult, params) {
                    for (var i = 0; i < params.length; i++) {
                        if (params[i] !== undefined) {
                            return params[i];
                        }
                    }
                    return defaultResult;
                };
                Utils.sendAjax = function (url, params) {
                    var deferred = Utils.defer();
                    var http = new XMLHttpRequest();
                    http.open("GET", Utils.combineUrlWithParams(url, params), true);
                    http.onreadystatechange = function () {
                        if (http.readyState == 4 && http.status >= 200 && http.status < 300) {
                            deferred.resolve(JSON.parse(http.responseText));
                        }
                        else if (http.readyState == 4) {
                            deferred.reject({
                                text: http.responseText,
                                status: http.status,
                                statusText: http.statusText
                            });
                        }
                    };
                    http.send(null);
                    return deferred.promise;
                };
                Utils.combineUrlWithParams = function (url, params) {
                    var paramsString = "";
                    for (var key in params) {
                        var value = encodeURIComponent(params[key]);
                        paramsString += "&" + key + "=" + value;
                    }
                    if (paramsString) {
                        paramsString = paramsString.substr(1);
                    }
                    var separator = '?';
                    if (url.indexOf('?') != -1) {
                        if (url[url.length - 1] == '?') {
                            separator = '';
                        }
                        else {
                            separator = '&';
                        }
                    }
                    return "" + url + separator + paramsString;
                };
                Utils.sortBy = function (property) {
                    property.order = property.order || "asc";
                    var sortOrder = property.order === "asc" ? 1 : -1;
                    var name = property.name;
                    return function (a, b) {
                        var result = (a[name] < b[name]) ? -1 : (a[name] > b[name]) ? 1 : 0;
                        return result * sortOrder;
                    };
                };
                Utils.sortByMultiple = function (props) {
                    return function (obj1, obj2) {
                        var i = 0, result = 0, numberOfProperties = props.length;
                        /* try getting a different result from 0 (equal)
                         * as long as we have extra properties to compare
                         */
                        while (result === 0 && i < numberOfProperties) {
                            result = Utils.sortBy(props[i])(obj1, obj2);
                            i++;
                        }
                        return result;
                    };
                };
                Utils.preventDefaultAndPropagation = function (e) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    else {
                        e.cancelBubble = true;
                    }
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    else {
                        e.returnValue = false;
                    }
                };
                Utils.removeFromArray = function (array, element) {
                    var index = array.indexOf(element);
                    if (index > -1) {
                        array.splice(index, 1);
                    }
                };
                /**
                 * Converts from dash notation to lower camel case notation,
                 * e.g.
                 * 1. unique-id -> uniqueId
                 * 2. uNiqUE-id -> uniqueId
                 * 3. Unique--id -> uniqueId
                 */
                Utils.convertFromDashToLowerCamelCaseNotation = function (name) {
                    var dashDetected = false;
                    var result = name[0].toLowerCase();
                    for (var i = 1; i < name.length; i++) {
                        var char = name[i];
                        if (char === '-') {
                            dashDetected = true;
                            continue;
                        }
                        if (dashDetected) {
                            result += char.toUpperCase();
                            dashDetected = false;
                            continue;
                        }
                        result += char.toLowerCase();
                    }
                    return result;
                };
                Utils.convertFromLowerCamelCaseToDashNotation = function (str) {
                    return str.replace(/\W+/g, '-')
                        .replace(/([a-z\d])([A-Z])/g, '$1-$2');
                };
                Utils.endsWith = function (subjectString, searchString) {
                    var position = subjectString.length;
                    position -= searchString.length;
                    var lastIndex = subjectString.indexOf(searchString, position);
                    return lastIndex !== -1 && lastIndex === position;
                };
                Utils.createReadFunction = function (promiseOrUrlOrData, options) {
                    if (options === void 0) { options = { allowData: true }; }
                    options.params = options.params || (function (x) { return x; });
                    if (promiseOrUrlOrData instanceof Function) {
                        var func_1 = promiseOrUrlOrData;
                        return function (context) {
                            var result = func_1(context);
                            if (result === undefined && options.allowUndefined) {
                                return undefined;
                            }
                            if (options.allowData && result instanceof Array) {
                                return Utils.createReadFunction(result);
                            }
                            if (!result || (!(typeof result === "string") && !result.then)) {
                                throw new Error(options.shouldReturnUrlOrPromiseError || 'Function should return url or promise.');
                            }
                            if (typeof result === "string") {
                                var url = result;
                                result = Utils.sendAjax(url, options.params(context));
                            }
                            return result;
                        };
                    }
                    if (typeof promiseOrUrlOrData == "string") {
                        // read should be an url
                        return function (context) { return Utils.sendAjax(promiseOrUrlOrData, options.params(context)); };
                    }
                    if (!options.allowData) {
                        throw new Error(options.dataMissingError);
                    }
                    return function () {
                        return new Promise(function (resolve) {
                            resolve(promiseOrUrlOrData);
                        });
                    };
                };
                // TODO: support IDictionary<T> autocompletion so that value could be T
                Utils.forOwn = function (obj, action) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var element = obj[key];
                            if (action(element, key) === false) {
                                break;
                            }
                        }
                    }
                };
                Utils.flatten = function (items) {
                    var result = [];
                    items.forEach(function (innerItems) { return innerItems.forEach(function (x) { return result.push(x); }); });
                    return result;
                };
                Utils.property = function (propertyExpression) {
                    var regexp = /function[^\(]*\(([^\)]*)\)[^\{]*\{[\s\S]*return[ ]+(\1|.+)(?:\.([^;]*)|\[['"]([^;]*)['"]\]);?[\s\S]*\}/i;
                    var expression = propertyExpression.toString();
                    var matches = regexp.exec(expression);
                    if (!matches || matches.length !== 5) {
                        throw new Error("Invalid expression: \"" + expression + "\". It should return property, but it doesn't.");
                    }
                    // 3 in case of `this.foo`
                    // 4 in case of `this['foo']`
                    return matches[3] || matches[4];
                };
                return Utils;
            }());
            exports_1("Utils", Utils);
            // Object.assign polyfill
            if (typeof Object.assign != 'function') {
                (function () {
                    Object.assign = function (target) {
                        'use strict';
                        if (target === undefined || target === null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        var output = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source !== undefined && source !== null) {
                                for (var nextKey in source) {
                                    if (source.hasOwnProperty(nextKey)) {
                                        output[nextKey] = source[nextKey];
                                    }
                                }
                            }
                        }
                        return output;
                    };
                })();
            }
        }
    }
});
