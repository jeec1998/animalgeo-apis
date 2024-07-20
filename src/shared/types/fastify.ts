import { type FastifyRequest } from 'fastify';

import { type User } from '../../user/models/user.model';

export type FastifyRequestWithUser = FastifyRequest & {
  user: User;
};
