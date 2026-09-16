export * from "./images";
export * from "./apiError";
export * from "./apiRoutes";

export const deviceType = {
  MOBILE: 1,
  DESKTOP: 2,
  TABLET: 3,
  WEARABLE: 4,
  IOT: 5,
};

export enum BrowserType {
  CHROME = "Google Chrome",
  FIREFOX = "Mozilla Firefox",
  SAFARI = "Safari",
  EDGE = "Microsoft Edge",
  OPERA = "Opera",
  IE = "Internet Explorer",
  OTHER = "Other",
  MOBILE = "Mobile",
}

export enum UPLOADED_IMAGE_TYPE {
  IMAGE = 1,
  VIDEO = 2,
  LOGO = 3,
}

export enum UPLOADED_IMAGE_MODULE {
  CODE_PUSH = "codepush",
}

export const regex = {
  Emojis: /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/g,
};
