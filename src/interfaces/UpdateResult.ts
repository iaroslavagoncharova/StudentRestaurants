// interface for updating user's data

import {User} from './User';

interface UpdateResult {
  message: string;
  data: User;
}

export type {UpdateResult};
