declare module "marvelous-aurelia-core/aureliaUtils" {
	import { ObserverLocator } from 'aurelia-binding';
	export class AureliaUtils {
	    observerLocator: ObserverLocator;
	    constructor(observerLocator: ObserverLocator);
	    observe(context: any, property: any, callback: any): () => void;
	    static bindable(mode?: any): (type: any, property: any) => any;
	}
}
declare module "marvelous-aurelia-core/compiler" {
	import { Container } from 'aurelia-dependency-injection';
	import { ViewCompiler, ViewResources, ViewSlot, ViewEngine } from 'aurelia-templating';
	export class Compiler {
	    viewCompiler: ViewCompiler;
	    resources: ViewResources;
	    container: Container;
	    viewEngine: ViewEngine;
	    constructor(viewCompiler: ViewCompiler, resources: ViewResources, container: Container, viewEngine: ViewEngine);
	    compile(element: HTMLElement, fragment: Element | DocumentFragment | string, context: any, overrideContext?: any): ViewSlot;
	    compileTemplate(element: any, templateUrl: string, ctx: any): Promise<ViewSlot>;
	}
}
declare module "marvelous-aurelia-core/interfaces" {
	export interface IDictionary<V> {
	    [key: string]: V;
	}
}
declare module "marvelous-aurelia-core/utils" {
	export let metadataKey: string;
	export let metadata: {
	    getOrCreate(obj: any): any;
	};
	export class Debouncer {
	    private _debounceTime;
	    private _executingId;
	    constructor(_debounceTime: number);
	    do(action: () => void): void;
	}
	export class DomUtils {
	    static isVisible(element: any): boolean;
	    static closest(element: any, tagName: any): any;
	    static offset(elem: any): {
	        top: number;
	        left: number;
	    };
	    static isCursorOverElement(element: any, event: any): boolean;
	    static clearInnerHtml(node: Node): void;
	    static getCaretPosition(input: any): any;
	    static setCaretPosition(element: Element, caretPos: any): void;
	    static addEventListener(element: Element, event: string, listener: (event) => void): () => void;
	}
	export class Utils {
	    static noop(): void;
	    static allDefined(obj: any, ...params: any[]): boolean;
	    static defer(): any;
	    /**
	     * Returns promise if promise given or wraps the value with the auto resolved promise.
	     */
	    static when<T>(valueOrPromise: T | Promise<T>): Promise<T>;
	    static firstDefined(defaultResult: any, params: any[]): any;
	    static sendAjax(url: string, params: any): any;
	    static combineUrlWithParams(url: any, params: any): string;
	    static sortBy(property: any): (a: any, b: any) => number;
	    static sortByMultiple(props: any): (obj1: any, obj2: any) => number;
	    static preventDefaultAndPropagation(e: any): void;
	    static removeFromArray(array: any, element: any): void;
	    /**
	     * Converts from dash notation to lower camel case notation,
	     * e.g.
	     * 1. unique-id -> uniqueId
	     * 2. uNiqUE-id -> uniqueId
	     * 3. Unique--id -> uniqueId
	     */
	    static convertFromDashToLowerCamelCaseNotation(name: string): string;
	    static convertFromLowerCamelCaseToDashNotation(str: any): any;
	    static endsWith(subjectString: string, searchString: string): boolean;
	    static createReadFunction(promiseOrUrlOrData: any, options?: ICreateReadFunctionOptions): (context: any) => Promise<any>;
	    static forOwn(obj: any, action: (value: any, key: string | number) => boolean | void): void;
	    static flatten<T>(items: T[][]): T[];
	    /**
	     * Gets property name from function. Inspired by C#'s expression tree based solution. ;)
	     */
	    static property<T>(propertyExpression: (x: T) => any): string;
	    static property<T>(propertyExpression: string): string;
	    static property(propertyExpression: string): string;
	    static property(propertyExpression: (x: any) => any): string;
	    static accessor(accessor: string): string;
	    static accessor<T>(accessor: (x: T) => any): string;
	}
	export interface ICreateReadFunctionOptions {
	    allowData: boolean;
	    params?: (context: any) => any;
	    allowUndefined?: boolean;
	    dataMissingError?: string;
	    shouldReturnUrlOrPromiseError?: string;
	}
}
declare module "marvelous-aurelia-core/optionsReader" {
	import { BindingEngine } from 'aurelia-binding';
	export class OptionsReaderFactory {
	    private _bindingEngine;
	    constructor(_bindingEngine: BindingEngine);
	    create(bindingContext: any, element: HTMLElement, codeBasedOptions?: any): OptionsReader;
	}
	export class OptionsReader {
	    private _element;
	    private _resources;
	    constructor(_element: HTMLElement, _resources: IReaderResources);
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
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
	     * Is true if defined. In case of code property it also checks whether it evaluates to a truthy value.
	     * This is especially helpful for checking whether particular component is enabled. For instance in the following configuration:
	     * `{ pagination: false }` - `pagination` is defined, but it is not truthy and therefore component shouldn't be enabled.
	     */
	    truthy: boolean;
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
	    private _propertyName;
	    element: HTMLElement;
	    private _resources;
	    defined: boolean;
	    name: string;
	    truthy: boolean;
	    constructor(_propertyName: string, element: HTMLElement, _resources: IReaderResources);
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
	    getAllProperties(): ISpecificReader[];
	    private _createInnerResources();
	    evaluate(defaultValue?: any): any;
	}
	export class CodeBasedArrayItemReader implements ISpecificReader {
	    private _item;
	    element: HTMLElement;
	    private _resources;
	    defined: boolean;
	    name: any;
	    truthy: boolean;
	    constructor(_item: any, element: HTMLElement, _resources: IReaderResources);
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
	    getAllProperties(): ISpecificReader[];
	    private _createInnerResources();
	    evaluate(): any;
	}
	export class ElementReader implements ISpecificReader {
	    element: HTMLElement;
	    private _resources;
	    defined: boolean;
	    name: any;
	    truthy: boolean;
	    constructor(element: HTMLElement, _resources: IReaderResources);
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
	    getAllProperties(): ISpecificReader[];
	    evaluate(): any;
	}
	export class AttributeReader implements ISpecificReader {
	    name: string;
	    private _value;
	    private _isExpression;
	    private _resources;
	    defined: boolean;
	    element: any;
	    truthy: boolean;
	    constructor(name: string, _value: any, _isExpression: boolean, _resources: IReaderResources);
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
	    getAllProperties(): ISpecificReader[];
	    evaluate(defaultValue?: any): any;
	}
	export class UndefinedElementReader implements ISpecificReader {
	    defined: boolean;
	    name: any;
	    element: any;
	    truthy: boolean;
	    get(selector: string): ISpecificReader;
	    getAll(selector: string): ISpecificReader[];
	    getAllProperties(): ISpecificReader[];
	    evaluate(defaultValue?: any): any;
	}
}
declare module "marvelous-aurelia-core/pubsub" {
	export class PubSub {
	    private _subscribers;
	    publish(name: string, payload: any): void;
	    subscribe(name: string, callback: (payload: any) => void): () => void;
	    unsubscribe(name: string, callback: (payload: any) => void): void;
	}
}
declare module "marvelous-aurelia-core" {
	export * from 'marvelous-aurelia-core/optionsReader';
	export * from 'marvelous-aurelia-core/pubsub';
}