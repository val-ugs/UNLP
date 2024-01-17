function buildFormData(
  formData: FormData,
  data: any,
  parentKey: any = undefined
) {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File) &&
    !(data instanceof Blob)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export const objectToFormData = (object: any): FormData => {
  const formData = new FormData();
  buildFormData(formData, object);
  return formData;
};
