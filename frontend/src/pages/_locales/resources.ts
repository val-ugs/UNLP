import { Language } from 'localization/languages';
import translationEN from './en/translation.json';
import translationRu from './ru/translation.json';

export const resources = {
  [Language.English]: {
    translation: translationEN,
  },
  [Language.Russian]: {
    translation: translationRu,
  },
};
