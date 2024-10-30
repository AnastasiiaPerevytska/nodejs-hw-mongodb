import { SORT_ORDER } from '../constants/index.js';
import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

    if (typeof filter.isFavourite === 'string') {
      filter.isFavourite = filter.isFavourite === 'true';
    }

    if (filter.contactType) {
      contactsQuery.where('contactType').equals(filter.contactType);
    }

if (filter.isFavourite === true) {
  contactsQuery.where('isFavourite').equals(true);
} else if (filter.isFavourite === false) {
  contactsQuery.where('isFavourite').equals(false);
}


  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
      data: contacts,
      ...paginationData,
    };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
