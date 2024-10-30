const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const validTypes = ['work', 'home', 'personal'];
  return validTypes.includes(contactType) ? contactType : undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'string') {
    return isFavourite.toLowerCase() === 'true';
  }
  return typeof isFavourite === 'boolean' ? isFavourite : undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
