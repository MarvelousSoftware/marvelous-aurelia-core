import {inject, Container} from 'aurelia-dependency-injection';
import {ViewCompiler, ViewResources, ViewSlot, ViewEngine} from 'aurelia-templating';

@inject(ViewCompiler, ViewResources, Container, ViewEngine)
export class Compiler {
  constructor(public viewCompiler: ViewCompiler, public resources: ViewResources, public container: Container,
    public viewEngine: ViewEngine) {
  }

  compile(element: HTMLElement, fragment: Element | DocumentFragment | string, context: any, overrideContext: any = undefined) {
    element.classList.remove('au-target');
    let view = this.viewCompiler.compile(fragment, this.resources).create(this.container);

    let viewSlot = new ViewSlot(element, true, undefined);
    viewSlot.add(view);
    viewSlot.bind(context, overrideContext);
    viewSlot.attached();
    return viewSlot;
  }
  
  compileTemplate(element, templateUrl: string, ctx) {
    return this.viewEngine.loadViewFactory(templateUrl).then(x => {
      let view = x.create(this.container);
      let viewSlot = new ViewSlot(element, true, undefined);
      
      viewSlot.add(view);
      viewSlot.bind(ctx, undefined);
      viewSlot.attached();
      
      return viewSlot;
    });
  }
}