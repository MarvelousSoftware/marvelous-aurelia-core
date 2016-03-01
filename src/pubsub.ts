import {IDictionary} from './interfaces';

export class PubSub {
  private _subscribers: IDictionary<((payload:any)=>void)[]> = {};
  
	publish(name: string, payload: any) {
    let subscribers = this._subscribers[name];
    if(!subscribers) {
      return;
    }
    subscribers.forEach(x => x(payload));
  }

  subscribe(name: string, callback: (payload:any)=>void) {
    this._subscribers[name] = this._subscribers[name] || [];
    this._subscribers[name].push(callback);
    return () => { this.unsubscribe(name, callback); };    
  }
  
  unsubscribe(name: string, callback: (payload:any)=>void) {
    let subscribers = this._subscribers[name];
    if(!subscribers) {
      return;
    }
    
    let index = this._subscribers[name].indexOf(callback);
    
    while(index !== -1) {
      this._subscribers[name].splice(index, 1);
      index = this._subscribers[name].indexOf(callback);
    }
  }
}