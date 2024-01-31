const StringIsNumber = (value: string) => isNaN(Number(value)) === false;

export const enumToArray = (en: any) => {
  return Object.keys(en)
    .filter(StringIsNumber)
    .map((key) => en[key]);
};
