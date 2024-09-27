import { Injectable } from '@angular/core';
import { WidgetContext } from 'thingsboard/src/app/modules/home/models/widget-component.models';

@Injectable({
  providedIn: 'root'
})
export class DynamicTimeseriesTableService {

  public widgetContext: WidgetContext;

  constructor() {
    // console.log('service', this.widgetContext)
  }

  getWidgetContext() {
    return this.widgetContext;
  }

  setWidgetContext(widgetContext: WidgetContext) {
    this.widgetContext = widgetContext;
  }
}
