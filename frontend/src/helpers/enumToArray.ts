export const enumToArray = (en: any) => {
  return Object.keys(en).map((key) => en[key]);
};
