import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.ts';
import { data } from './data/resource.ts';

const backend = defineBackend({
  auth,
  data,
});

export { backend };
export default backend;
