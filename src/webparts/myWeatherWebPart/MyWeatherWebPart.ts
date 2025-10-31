import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import MyWeather from './components/MyWeather';
import { IMyWeatherProps } from './components/IMyWeatherProps';

export interface IMyWeatherWebPartProps {
  apiKey: string;
  units: 'metric' | 'imperial' | 'standard';
  title: string;
}

export default class MyWeatherWebPart extends BaseClientSideWebPart<IMyWeatherWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyWeatherProps> = React.createElement(
      MyWeather,
      {
        apiKey: this.properties.apiKey,
        units: (this.properties.units as 'metric' | 'imperial' | 'standard') || 'metric',
        title: this.properties.title || this.properties.title || this.context.pageContext.site.title
      } as IMyWeatherProps
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: this.context
              && this.context.manifest
              && this.context.manifest.preconfiguredEntries
              && this.context.manifest.preconfiguredEntries[0]
              && this.context.manifest.preconfiguredEntries[0].title
              ? (this.context.manifest.preconfiguredEntries[0].title as any).default
              : 'Weather web part settings'
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: this.properties.title ? 'Web part title' : 'Web part title'
                }),
                PropertyPaneTextField('apiKey', {
                  label: 'OpenWeatherMap API key',
                  description: 'Get one at https://openweathermap.org/'
                }),
                PropertyPaneDropdown('units', {
                  label: 'Units',
                  options: [
                    { key: 'metric', text: 'Metric (°C)' },
                    { key: 'imperial', text: 'Imperial (°F)' },
                    { key: 'standard', text: 'Standard (Kelvin)' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}