import { resources as commonResources } from 'components/common/_locales/resources';
import { resources as interstitialResources } from 'components/interstitial/_locales/resources';
import { resources as modalsResources } from 'components/modals/_locales/resources';
import { resources as pagesResources } from 'pages/_locales/resources';

export const resources = deepMerge(
  commonResources,
  interstitialResources,
  modalsResources,
  pagesResources
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(...objs: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let merged: any = {};
  objs.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (obj: any) =>
      (merged = {
        ...merged,
        ...obj,
      })
  );

  for (const key of Object.keys(merged)) {
    if (typeof merged[key] === 'object' && merged[key] !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      objs.map((obj: any) => {
        merged[key] = deepMerge(merged[key], obj[key]);
      });
    }
  }

  return merged;
}
