///
/// Copyright © 2016-2024 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { BasicWidgetConfigComponent } from '@home/components/public-api';

import { WidgetConfigComponent } from '@home/components/widget/widget-config.component';

import { WidgetConfigComponentData, WidgetContext } from '@home/models/widget-component.models';

import { DataKey, Datasource, JsonSettingsSchema, WidgetActionSource, WidgetConfig, WidgetLayout, WidgetTypeParameters, widgetType } from '@shared/public-api'

import { DataKeyType } from '@shared/public-api'
import { deepClone, isUndefined } from '@core/public-api'

import { registerLocaleData } from "@angular/common";
import de from '@angular/common/locales/de';
import { DynamicTimeseriesTableService } from '../dynamic-timeseries-table.service';

registerLocaleData(de);




@Component({
    selector: 'tb-dynamic-timeseries-table-basic-config',
    templateUrl: './dynamic-timeseries-table-basic-config.component.html',
    styleUrls: []
})
export class DynamicTimeseriesTableBasicConfigComponent extends BasicWidgetConfigComponent {

    public ctx: WidgetContext;

    public dataKeyTypes = ['test 1', 'test 2', 'test 3'] //for dropdown
    public timestampTypes = ['START', 'MIDDLE', 'END'];

    public get datasource(): Datasource {
        const datasources: Datasource[] = this.timeseriesTableWidgetConfigForm.get('datasources').value;
        if (datasources && datasources.length) {
            return datasources[0];
        } else {
            return null;
        }
    }

    timeseriesTableWidgetConfigForm: UntypedFormGroup;

    constructor(protected store: Store<AppState>,
        protected widgetConfigComponent: WidgetConfigComponent,
        private dynamicTimeseriesTableService: DynamicTimeseriesTableService,
        private fb: UntypedFormBuilder) {
        super(store, widgetConfigComponent);
    }

    protected configForm(): UntypedFormGroup {
        return this.timeseriesTableWidgetConfigForm;
    }

    protected defaultDataKeys(configData: WidgetConfigComponentData): DataKey[] {
        return [{ name: 'temperature', label: 'Temperature', type: DataKeyType.timeseries, units: '°C', decimals: 0 }];
    }

    protected onConfigSet(configData: WidgetConfigComponentData) {
        this.timeseriesTableWidgetConfigForm = this.fb.group({

            datasources: [configData.config.datasources, []],
            columns: [this.getColumns(configData.config.datasources), []],
            showTitle: [configData.config.showTitle, []],
            title: [configData.config.title, []],
            titleFont: [configData.config.titleFont, []],
            titleColor: [configData.config.titleColor, []],
            showTitleIcon: [configData.config.showTitleIcon, []],
            titleIcon: [configData.config.titleIcon, []],
            iconColor: [configData.config.iconColor, []],
            cardButtons: [this.getCardButtons(configData.config), []],
            color: [configData.config.color, []],
            backgroundColor: [configData.config.backgroundColor, []],
            actions: [configData.config.actions || {}, []],
            //new custom fields
            // isChecked: [false],
            // randomText: [],
            // customDropdown: [],
            enableDataManipulation: [configData.config.enableDataManipulation || false, []],
            timestampType: [configData.config.timestampType, []],
            //user user's language
            useLanguageFormat: [configData.config.useLanguageFormat, []]
        });
    }

    protected prepareOutputConfig(config: any): WidgetConfigComponentData {
        this.widgetConfig.config.datasources = config.datasources;
        this.setColumns(config.columns, this.widgetConfig.config.datasources);
        this.widgetConfig.config.actions = config.actions;
        this.widgetConfig.config.showTitle = config.showTitle;
        this.widgetConfig.config.title = config.title;
        this.widgetConfig.config.titleFont = config.titleFont;
        this.widgetConfig.config.titleColor = config.titleColor;
        this.widgetConfig.config.showTitleIcon = config.showTitleIcon;
        this.widgetConfig.config.titleIcon = config.titleIcon;
        this.widgetConfig.config.iconColor = config.iconColor;
        this.widgetConfig.config.settings = this.widgetConfig.config.settings || {};
        this.setCardButtons(config.cardButtons, this.widgetConfig.config);
        this.widgetConfig.config.color = config.color;
        this.widgetConfig.config.backgroundColor = config.backgroundColor;
        // this.widgetConfig.config.isChecked = config.isChecked;
        // this.widgetConfig.config.randomText = config.randomText;
        // this.widgetConfig.config.customDropdown = config.customDropdown;
        this.widgetConfig.config.enableDataManipulation = config.enableDataManipulation;
        this.widgetConfig.config.timestampType = config.timestampType;
        this.widgetConfig.config.useLanguageFormat = config.useLanguageFormat;
        return this.widgetConfig;
    }

    protected validatorTriggers(): string[] {
        return ['showTitle', 'showTitleIcon'];
    }

    protected updateValidators(emitEvent: boolean, trigger?: string) {
        const showTitle: boolean = this.timeseriesTableWidgetConfigForm.get('showTitle').value;
        const showTitleIcon: boolean = this.timeseriesTableWidgetConfigForm.get('showTitleIcon').value;
        if (showTitle) {
            this.timeseriesTableWidgetConfigForm.get('title').enable();
            this.timeseriesTableWidgetConfigForm.get('titleFont').enable();
            this.timeseriesTableWidgetConfigForm.get('titleColor').enable();
            this.timeseriesTableWidgetConfigForm.get('showTitleIcon').enable({ emitEvent: false });
            if (showTitleIcon) {
                this.timeseriesTableWidgetConfigForm.get('titleIcon').enable();
                this.timeseriesTableWidgetConfigForm.get('iconColor').enable();
            } else {
                this.timeseriesTableWidgetConfigForm.get('titleIcon').disable();
                this.timeseriesTableWidgetConfigForm.get('iconColor').disable();
            }
        } else {
            this.timeseriesTableWidgetConfigForm.get('title').disable();
            this.timeseriesTableWidgetConfigForm.get('titleFont').disable();
            this.timeseriesTableWidgetConfigForm.get('titleColor').disable();
            this.timeseriesTableWidgetConfigForm.get('showTitleIcon').disable({ emitEvent: false });
            this.timeseriesTableWidgetConfigForm.get('titleIcon').disable();
            this.timeseriesTableWidgetConfigForm.get('iconColor').disable();
        }
        this.timeseriesTableWidgetConfigForm.get('title').updateValueAndValidity({ emitEvent });
        this.timeseriesTableWidgetConfigForm.get('titleFont').updateValueAndValidity({ emitEvent });
        this.timeseriesTableWidgetConfigForm.get('titleColor').updateValueAndValidity({ emitEvent });
        this.timeseriesTableWidgetConfigForm.get('showTitleIcon').updateValueAndValidity({ emitEvent: false });
        this.timeseriesTableWidgetConfigForm.get('titleIcon').updateValueAndValidity({ emitEvent });
        this.timeseriesTableWidgetConfigForm.get('iconColor').updateValueAndValidity({ emitEvent });
    }

    private getColumns(datasources?: Datasource[]): DataKey[] {
        if (datasources && datasources.length) {
            const dataKeys = deepClone(datasources[0].dataKeys) || [];
            dataKeys.forEach(k => {
                (k as any).latest = false;
            });
            const latestDataKeys = deepClone(datasources[0].latestDataKeys) || [];
            latestDataKeys.forEach(k => {
                (k as any).latest = true;
            });
            return dataKeys.concat(latestDataKeys);
        }
        return [];
    }

    private setColumns(columns: DataKey[], datasources?: Datasource[]) {
        if (datasources && datasources.length) {
            const dataKeys = deepClone(columns.filter(c => !(c as any).latest));
            dataKeys.forEach(k => delete (k as any).latest);
            const latestDataKeys = deepClone(columns.filter(c => (c as any).latest));
            latestDataKeys.forEach(k => delete (k as any).latest);
            datasources[0].dataKeys = dataKeys;
            datasources[0].latestDataKeys = latestDataKeys;
        }
    }

    private getCardButtons(config: WidgetConfig): string[] {
        const buttons: string[] = [];
        if (isUndefined(config.settings?.enableSearch) || config.settings?.enableSearch) {
            buttons.push('search');
        }
        if (isUndefined(config.settings?.enableSelectColumnDisplay) || config.settings?.enableSelectColumnDisplay) {
            buttons.push('columnsToDisplay');
        }
        if (isUndefined(config.enableFullscreen) || config.enableFullscreen) {
            buttons.push('fullscreen');
        }
        return buttons;
    }

    private setCardButtons(buttons: string[], config: WidgetConfig) {
        config.settings.enableSearch = buttons.includes('search');
        config.settings.enableSelectColumnDisplay = buttons.includes('columnsToDisplay');
        config.enableFullscreen = buttons.includes('fullscreen');
    }

    ngOnInit(): void {
        //console.log('ctx', this.ctx)
        this.ctx = this.dynamicTimeseriesTableService.getWidgetContext();
        // this.timeseriesTableWidgetConfigForm.get('randomText').valueChanges.subscribe(val => console.log('Random text value changed to: ' + val)); //if value change, output in console
        // this.timeseriesTableWidgetConfigForm.get('customDropdown').valueChanges.subscribe(val => console.log('custom dropdown value changed to: ' + val));
        // this.timeseriesTableWidgetConfigForm.get('isChecked').valueChanges.subscribe(val => console.log('Ischecked value changed to: ' + val));
        this.timeseriesTableWidgetConfigForm.get('enableDataManipulation').valueChanges.subscribe(val => {
            //console.log('Enable Data Manipulation is set to: ' + val);
            this.widgetConfig.config.enableDataManipulation = val;
        })
        this.timeseriesTableWidgetConfigForm.get('timestampType').valueChanges.subscribe(val => {
            //console.log('timestamp value changed to: ' + val);
        this.widgetConfig.config.timestampType = val;
        })
        this.timeseriesTableWidgetConfigForm.get('useLanguageFormat').valueChanges.subscribe(val => {
            //console.log('Use language format: ' + val);
            //console.log('Ctx current lang: ' + this.ctx.translate.currentLang)
            //console.log('store', this.store);
            this.ctx.widgetConfig.useLanguageFormat = val;
        });
    }
}