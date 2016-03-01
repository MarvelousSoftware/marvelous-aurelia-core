import {IDictionary} from './interfaces';

export let metadataKey = '__marvelous-metadata__';
export let metadata = {
  getOrCreate(obj: any) {
    if (!!obj[metadataKey] === false) {
      obj[metadataKey] = {};
    }
    return obj[metadataKey];
  }
}

export class Debouncer {
  private _executingId: number;

  constructor(private _debounceTime: number) {
  }

  do(action: () => void) {
    if (this._debounceTime === undefined || this._debounceTime <= 0) {
      action();
    }

    if (this._executingId !== undefined) {
      clearTimeout(this._executingId);
    }

    this._executingId = setTimeout(function() {
      action();
    }, this._debounceTime);
  }
}

export class DomUtils {
  static isVisible(element) {
    return element.getClientRects().length > 0;
  }

  static closest(element, tagName) {
    while (element && element.tagName != tagName) {
      element = element.parentElement;
    }

    return element;
  }
  
  static offset(elem) {
    let docElem, win, rect, doc;
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
  }

  static isCursorOverElement(element, event) {
    let cursor = {
      left: event.pageX,
      top: event.pageY
    };

    let border: any = DomUtils.offset(element);
    border.right = border.left + element.clientWidth;
    border.bottom = border.top + element.clientHeight;

    return border.top <= cursor.top && border.bottom >= cursor.top &&
      border.left <= cursor.left && border.right >= cursor.left;
  }
  
  static clearInnerHtml(node: Node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
    }
  }
  
  static getCaretPosition(input) {
    // Internet Explorer Caret Position (TextArea)
    let caretPosition;
    let doc: any = document;
    if (doc.selection && doc.selection.createRange) {
      let range = doc.selection.createRange();
      let bookmark = range.getBookmark();
      caretPosition = bookmark.charCodeAt(2) - 2;
    } else {
      // Firefox Caret Position (TextArea)
      if (input.setSelectionRange)
        caretPosition = input.selectionStart;
    }

    return caretPosition;
  }

  static setCaretPosition(element: Element, caretPos) {
    let elem: any = element;
    if (elem != null) {
      if (elem.createTextRange) {
        let range = elem.createTextRange();
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
  }
  
  static addEventListener(element: Element, event: string, listener: (event) => void) {
    element.addEventListener(event, listener);
    return () => {
      element.removeEventListener(event, listener);
    }
  }
}

export class Utils {
  static noop() { }

  static allDefined(obj, ...params) {
    for (let i = 0; i < params.length; i++) {
      if (obj[params[i]] === undefined) {
        return false;
      }
    }
    return true;
  }

  static defer() {
    // TODO: return appropriate type (generic one)!
    let deferred;

    let promise = new Promise((resolve, reject) => {
      deferred = {
        resolve: function(...args) {
          resolve.apply(this, args);
        },
        reject: function(...args) {
          reject.apply(this, args);
        }
      };
    });

    deferred.promise = promise;
    return deferred;
  }
  
  /**
   * Returns promise if promise given or wraps the value with the auto resolved promise.
   */
  static when<T>(valueOrPromise: T | Promise<T>): Promise<T> {
    let promise = (<Promise<T>>valueOrPromise);
    if (promise.then instanceof Function && promise['catch'] instanceof Function) {
      return promise;
    }

    let deferred = Utils.defer();
    deferred.resolve(valueOrPromise);
    return deferred.promise;
  }

  static firstDefined(defaultResult: any, params: any[]) {
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== undefined) {
        return params[i];
      }
    }
    return defaultResult;
  }

  static sendAjax(url: string, params) {
    let deferred = Utils.defer();
    let http = new XMLHttpRequest();

    http.open("GET", Utils.combineUrlWithParams(url, params), true);
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status >= 200 && http.status < 300) {
        deferred.resolve(JSON.parse(http.responseText));
      } else if (http.readyState == 4) {
        deferred.reject({
          text: http.responseText,
          status: http.status,
          statusText: http.statusText
        });
      }
    }
    http.send(null);
    return deferred.promise;
  }

  static combineUrlWithParams(url, params) {
    let paramsString = "";
    for (let key in params) {
      let value = encodeURIComponent(params[key]);
      paramsString += `&${key}=${value}`;
    }
    if (paramsString) {
      paramsString = paramsString.substr(1);
    }

    let separator = '?';
    if (url.indexOf('?') != -1) {
      if (url[url.length - 1] == '?') {
        separator = '';
      }
      else {
        separator = '&';
      }
    }

    return `${url}${separator}${paramsString}`;
  }

  static sortBy(property) {
    property.order = property.order || "asc";
    let sortOrder = property.order === "asc" ? 1 : -1;
    let name = property.name;
    return function(a, b) {
      let result = (a[name] < b[name]) ? -1 : (a[name] > b[name]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  static sortByMultiple(props) {
    return function(obj1, obj2) {
      let i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while (result === 0 && i < numberOfProperties) {
        result = Utils.sortBy(props[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }

  static preventDefaultAndPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }

    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  static removeFromArray(array, element) {
    let index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
  
  /**
   * Converts from dash notation to lower camel case notation, 
   * e.g. 
   * 1. unique-id -> uniqueId
   * 2. uNiqUE-id -> uniqueId
   * 3. Unique--id -> uniqueId
   */
  static convertFromDashToLowerCamelCaseNotation(name: string): string {
    let dashDetected = false;
    let result = name[0].toLowerCase();

    for (let i = 1; i < name.length; i++) {
      let char = name[i];
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
  }

  static convertFromLowerCamelCaseToDashNotation(str) {
    return str.replace(/\W+/g, '-')
      .replace(/([a-z\d])([A-Z])/g, '$1-$2');
  }

  static endsWith(subjectString: string, searchString: string) {
    let position = subjectString.length;
    position -= searchString.length;
    let lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }

  static createReadFunction(promiseOrUrlOrData, options: ICreateReadFunctionOptions = { allowData: true }) {
    options.params = options.params || (x => x);
    
    if (promiseOrUrlOrData instanceof Function) {
      let func = promiseOrUrlOrData;

      return (context) => {
        let result = func(context);

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
          let url = result;
          result = Utils.sendAjax(url, options.params(context))
        }

        return result;
      }
    }
    if (typeof promiseOrUrlOrData == "string") {
      // read should be an url
      return context => Utils.sendAjax(promiseOrUrlOrData, options.params(context));
    }

    if (!options.allowData) {
      throw new Error(options.dataMissingError);
    }

    return function() {
      return new Promise<any>((resolve) => {
        resolve(promiseOrUrlOrData);
      });
    }
  }
  
  // TODO: support IDictionary<T> autocompletion so that value could be T
  static forOwn(obj: any, action: (value: any, key: string | number) => boolean | void) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let element = obj[key];
        if (action(element, key) === false) {
          break;
        }
      }
    }
  }

  static flatten<T>(items: T[][]): T[] {
    let result: T[] = [];
    items.forEach(innerItems => innerItems.forEach(x => result.push(x)));
    return result;
  }

  static property(propertyExpression: string): string;
  static property(propertyExpression: (x: any) => any): string;
  /**
   * Gets property name from function. Inspired by C#'s expression tree based solution. ;)
   */
  static property<T>(propertyExpression: (x: T) => any): string;
  static property<T>(propertyExpression: string): string;
  static property<T>(propertyExpression: ((x: T) => any) | string): string {
    let regexp = /function[^\(]*\(([^\)]*)\)[^\{]*\{[\s\S]*return[ ]+(\1|.+)(?:\.([^;]*)|\[['"]([^;]*)['"]\]);?[\s\S]*\}/i;
    let expression = propertyExpression.toString();
    let matches = regexp.exec(expression);

    if (!matches || matches.length !== 5) {
      throw new Error(`Invalid expression: "${expression}". It should return property, but it doesn't.`);
    }
    
    // 3 in case of `this.foo`
    // 4 in case of `this['foo']`
    return matches[3] || matches[4];
  }
}

export interface ICreateReadFunctionOptions {
  allowData: boolean;
  params?: (context:any)=>any;
  allowUndefined?: boolean;
  dataMissingError?: string;
  shouldReturnUrlOrPromiseError?: string
}

// Object.assign polyfill
if (typeof Object.assign != 'function') {
  (function() {
    Object.assign = function(target) {
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