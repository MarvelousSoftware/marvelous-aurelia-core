import {ObserverLocator} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {bindable} from 'aurelia-templating';

@inject(ObserverLocator)
export class AureliaUtils {
	observerLocator : ObserverLocator;
	
	constructor(observerLocator : ObserverLocator) {
		this.observerLocator = observerLocator;
	}
	
	observe(context, property, callback) {
		this.observerLocator.getObserver(context, property).subscribe(callback);
		return () => {
			this.observerLocator.getObserver(context, property).unsubscribe(callback);
		}
	}
  
  static bindable(mode = undefined) {
    return (type, property) => {
      // todo: attribute
      return bindable({
        name: property,
        defaultBindingMode: mode
      })(type, property);
    }
  }
}