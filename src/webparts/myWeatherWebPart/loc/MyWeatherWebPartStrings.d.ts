declare interface IMyWeatherWebPartStrings {
  PropertyPaneDescription: string;
  TitleFieldLabel: string;
  ApiKeyFieldLabel: string;
  UnitsFieldLabel: string;
}

declare module 'MyWeatherWebPartStrings' {
  const strings: IMyWeatherWebPartStrings;
  export = strings;
}