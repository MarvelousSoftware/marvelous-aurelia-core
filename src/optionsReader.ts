import {inject} from 'aurelia-dependency-injection';
import {BindingEngine} from 'aurelia-binding';
import {Utils} from './utils';

@inject(BindingEngine)
export class OptionsReaderFactory {
  constructor(private _bindingEngine: BindingEngine) {
  }

  create(bindingContext: any, element: HTMLElement, codeBasedOptions: any = undefined) {
    return new OptionsReader(element, {
      bindingContext,
      bindingEngine: this._bindingEngine,
      codeBasedOptions
    });
  }
}

export class OptionsReader {
  constructor(private _element: HTMLElement, private _resources: IReaderResources) {
  }

  get(selector: string): ISpecificReader {
    return getReaderBySelector(selector, this._element, this._resources);
  }

  getAll(selector: string): ISpecificReader[] {
    return getAllReadersBySelector(selector, this._element, this._resources);
  }
}

export interface IReaderResources {
  bindingContext: any;
  bindingEngine: BindingEngine;
  codeBasedOptions: any;
  parent?: IReaderResources;
}

export interface ISpecificReader {
  /**
   * Indicates whether selector evaluates to existing value.
   * this makes following scenario possible: 
   * 
   * let pagination = reader.get('pagination');
   * // when pagination does not exist in the provided options
   * // then throws error
   * if(pagination.defined === false) throw new Error();
   */
  defined: boolean;

  /**
   * Name of the associated element. Mighe be undefined if not relevant.
   */
  name: string;

  /**
   * Element from DOM which is used by the reader. Mighe be undefined if reader is not using DOM
   * to parse options.
   */
  element: HTMLElement;

  /**
   * Get reader basing on provided selector.
   * Always returns some reader, never throws exception.
   */
  get(selector: string): ISpecificReader;

  /**
   * Gets all element readers basing on provided selector.
   * Always returns an array, never throws exception.
   */
  getAll(selector: string): ISpecificReader[];

  /**
   * Gets all properties. In case of node it will return all atributes,
   * and in case of code based option it will return all properties.
   * Always returns an array, never throws exception.
   */
  getAllProperties(): ISpecificReader[];

  /**
   * Evaluates current reader.
   */
  evaluate(defaultValue?: any): any;
}

export class CodeBasedPropertyReader implements ISpecificReader {
  get defined() { return true; }
  get name() { return this._propertyName; }

  constructor(private _propertyName: string, public element: HTMLElement, private _resources: IReaderResources) {
  }

  get(selector: string): ISpecificReader {
    return getReaderBySelector(selector, this.element, this._createInnerResources());
  }

  getAll(selector: string): ISpecificReader[] {
    return getAllReadersBySelector(selector, this.element, this._createInnerResources());
  }

  getAllProperties(): ISpecificReader[] {
    return getAllProperties(this.element, this._createInnerResources());
  }

  private _createInnerResources() {
    return {
      bindingContext: this._resources.bindingContext,
      bindingEngine: this._resources.bindingEngine,
      codeBasedOptions: this._resources.codeBasedOptions[this._propertyName],
      parent: this._resources
    }
  }

  evaluate(defaultValue?: any): any {
    let result = this._resources.codeBasedOptions[this._propertyName]; 
    return result === undefined ? defaultValue : result;
  }
}

export class CodeBasedArrayItemReader implements ISpecificReader {
  get defined() { return true; }
  get name() { return undefined; }

  constructor(private _item: any, public element: HTMLElement, private _resources: IReaderResources) {
  }

  get(selector: string): ISpecificReader {
    return getReaderBySelector(selector, this.element, this._createInnerResources());
  }

  getAll(selector: string): ISpecificReader[] {
    return getAllReadersBySelector(selector, this.element, this._createInnerResources());
  }

  getAllProperties(): ISpecificReader[] {
    return getAllProperties(this.element, this._createInnerResources());
  }

  private _createInnerResources() {
    return {
      bindingContext: this._resources.bindingContext,
      bindingEngine: this._resources.bindingEngine,
      codeBasedOptions: this._item,
      parent: this._resources
    }
  }

  evaluate(): any {
    throw new Error(`Array item cannot be evaluated. Only properties are evaluable.`);
  }
}

export class ElementReader implements ISpecificReader {
  get defined() { return true; }
  get name() { return undefined; }

  constructor(public element: HTMLElement, private _resources: IReaderResources) {
  }

  get(selector: string): ISpecificReader {
    return getReaderBySelector(selector, this.element, this._resources);
  }

  getAll(selector: string): ISpecificReader[] {
    return getAllReadersBySelector(selector, this.element, this._resources);
  }

  getAllProperties(): ISpecificReader[] {
    return getAllProperties(this.element, {
      bindingContext: this._resources.bindingContext,
      bindingEngine: this._resources.bindingEngine,
      codeBasedOptions: undefined,
      parent: this._resources
    });
  }

  evaluate(): any {
    throw new Error(`${this.element.tagName} cannot be evaluated, because it is a node. Only attributes are evaluable.`);
  }
}

export class AttributeReader implements ISpecificReader {
  get defined() { return true; }
  get element() { return undefined; }

  constructor(public name: string, private _value: any, private _isExpression: boolean, private _resources: IReaderResources) {
  }

  get(selector: string): ISpecificReader {
    throw new Error('Attribute cannot have any nested options.');
  }

  getAll(selector: string): ISpecificReader[] {
    throw new Error('Attribute cannot have any nested options.');
  }

  getAllProperties(): ISpecificReader[] {
    throw new Error('Attribute cannot have any property.');
  }

  evaluate(defaultValue?: any): any {
    if (!this._isExpression) {
      return this._value;
    }

    let result = this._resources.bindingEngine.parseExpression(this._value).evaluate({
      bindingContext: this._resources.bindingContext,
      overrideContext: undefined
    }, undefined);

    return result === undefined ? defaultValue : result;
  }
}

export class UndefinedElementReader implements ISpecificReader {
  get defined() { return false; }
  get name() { return undefined; }
  get element() { return undefined; }

  get(selector: string): ISpecificReader {
    return this;
  }

  getAll(selector: string): ISpecificReader[] {
    return [this];
  }

  getAllProperties(): ISpecificReader[] {
    return [];
  }

  evaluate(defaultValue?: any): any {
    return defaultValue;
  }
}

function getReaderBySelector(selector: string, element: HTMLElement, resources: IReaderResources): ISpecificReader {
  if (!selector) {
    throw new Error(`Empty selector for ${element.tagName} element.`);
  }

  let names = selector.split(' ').map(x => x.trim());
  let codeReader = getReaderFromCode(names, element, resources);
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

function getReaderFromCode(properties: string[], element: HTMLElement, resources: IReaderResources): ISpecificReader {
  if (!resources.codeBasedOptions) {
    return undefined;
  }

  let propertyIndex = 0;
  let currentPropertyName;
  let currentOption = resources.codeBasedOptions;
  let parentOption: any;

  while (propertyIndex < properties.length) {
    currentPropertyName = Utils.convertFromDashToLowerCamelCaseNotation(properties[propertyIndex]);

    if (typeof currentOption !== 'object' || (currentPropertyName in currentOption) === false) {
      return undefined;
    }

    parentOption = currentOption;
    currentOption = currentOption[currentPropertyName];
    propertyIndex++;
  }

  let currentElement: HTMLElement;
  if (element) {
    currentElement = <HTMLElement>element.querySelector(properties.join(' '));
  }

  return new CodeBasedPropertyReader(currentPropertyName, currentElement, {
    bindingContext: resources.bindingContext,
    bindingEngine: resources.bindingEngine,
    codeBasedOptions: parentOption,
    parent: resources
  });
}

function getReaderFromDom(nodeNames: string[], element: HTMLElement, resources: IReaderResources): ISpecificReader {
  if (!element) {
    return new UndefinedElementReader();
  }

  let currentNode = element;
  let prevNode: HTMLElement;
  for (let i = 0; i < nodeNames.length; i++) {
    let nodeName = nodeNames[i];
    prevNode = currentNode;
    currentNode = <HTMLElement>currentNode.querySelector(nodeName);
    if (!currentNode) {
      // if last element from selector then it might be an attribute
      // from previous node, e.g. `components pagination --->size<---`
      let attribute = getAttribute(prevNode, nodeName);
      if (i === nodeNames.length - 1 && attribute) {
        return new AttributeReader(nodeName, attribute.value, attribute.isExpression, resources);
      }

      return new UndefinedElementReader();
    }
  }

  return new ElementReader(currentNode, resources);
}

function getAllReadersBySelector(selector: string, element: HTMLElement, resources: IReaderResources) {
  if (!selector) {
    throw new Error(`Empty selector for ${element.tagName} element.`);
  }

  let names = selector.split(' ').map(x => x.trim());
  let codeReaders = getAllReadersFromCode(names, element, resources);
  if (codeReaders) {
    return codeReaders;
  }

  return getAllReadersFromDom(names, element, resources) || [];
}

function getAllReadersFromCode(properties: string[], element: HTMLElement, resources: IReaderResources) {
  let all: ISpecificReader[] = [];

  if (!resources.codeBasedOptions) {
    return undefined;
  }

  let propertyIndex = 0;
  let currentPropertyName;
  let currentOption = resources.codeBasedOptions;
  let parentOption: any = currentOption;

  // in case of code selectors last property name is not relevant, e.g.
  // dom: <m-component><foo><bar value="1"></bar></foo></m-component>
  // code: { foo: [value: '1'] }
  // that's why `properties.length - 1`
  while (propertyIndex < properties.length - 1) {
    currentPropertyName = Utils.convertFromDashToLowerCamelCaseNotation(properties[propertyIndex]);

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

  let options = <Array<any>>currentOption;

  options.forEach(option => {
    all.push(new CodeBasedArrayItemReader(option, undefined, {
      bindingContext: resources.bindingContext,
      bindingEngine: resources.bindingEngine,
      codeBasedOptions: parentOption,
      parent: resources
    }));
  });

  return all;
}

function getAllReadersFromDom(nodeNames: string[], element: HTMLElement, resources: IReaderResources) {
  let all: ISpecificReader[] = [];

  let currentNode = element;
  for (let i = 0; i < nodeNames.length - 1; i++) {
    let nodeName = nodeNames[i];
    currentNode = <HTMLElement>currentNode.querySelector(nodeName);
    if (!currentNode) {
      break;
    }
  }

  let parentNode = currentNode;
  if (!parentNode) {
    return undefined;
  }

  let nodeName = nodeNames[nodeNames.length - 1];
  let elements = parentNode.querySelectorAll(nodeName);
  for (let i = 0; i < elements.length; i++) {
    let element = <HTMLElement>elements[i];
    all.push(new ElementReader(element, resources));
  }

  return all;
}

function getAllProperties(element: HTMLElement, resources: IReaderResources) {
  let all: ISpecificReader[] = [];

  if (resources.codeBasedOptions) {
    for (let name in resources.codeBasedOptions) {
      all.push(new CodeBasedPropertyReader(name, element, resources));
    }
  } else if (element) {
    let attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      let name = attributes[i].name;
      let attribute = getAttribute(element, name);
      all.push(new AttributeReader(attribute.name, attribute.value, attribute.isExpression, resources))
    }
  }

  return all;
}

function getAttribute(element: HTMLElement, name: string) {
  if (!element) {
    return undefined;
  }
  const bind = '.bind';
  const oneTime = '.one-time';

  if (element.hasAttribute(name)) {
    let value = element.getAttribute(name);
    let isExpression = false;
    let shortName = name;

    if (Utils.endsWith(name, bind)) {
      isExpression = true;
      shortName = name.substr(0, name.length - bind.length);
    } else if (Utils.endsWith(name, oneTime)) {
      isExpression = true;
      shortName = name.substr(0, name.length - oneTime.length);
    }

    return {
      name: shortName,
      value: isExpression === false && value === '' ? true : value,
      isExpression: isExpression
    }
  }

  let value = element.getAttribute(name + bind) || element.getAttribute(name + oneTime);
  if (value !== null) {
    return {
      name: name,
      value: value,
      isExpression: true
    }
  }

  let isNotAllowedBinding = !!(element.getAttribute(name + '.one-way') || element.getAttribute(name + '.two-way'));
  if (isNotAllowedBinding) {
    throw new Error('one-way and two-way bindings are not allowed in the options definition.');
  }

  return undefined;
}