export const toDatetimeLocalValue = (iso?: string | null): string => {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
};

export const toIsoFromLocal = (localValue: string): string | undefined => {
  if (!localValue) {
    return undefined;
  }

  return new Date(localValue).toISOString();
};
