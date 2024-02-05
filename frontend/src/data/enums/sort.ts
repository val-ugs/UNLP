export enum Sort {
  Without = '',
  Asc = 'asc',
  Desc = 'desc',
}

export const getNextSort = (sort: Sort) => {
  switch (sort) {
    case Sort.Without:
      return Sort.Asc;
    case Sort.Asc:
      return Sort.Desc;
    case Sort.Desc:
      return Sort.Without;
  }
};
