import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
    givenName: {
      required: true,
    },
    familyName: {
      required: true,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
    },
    'custom:hotelId': {
      dataType: 'String',
      mutable: true,
    },
  },
});
