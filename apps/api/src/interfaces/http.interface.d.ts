import type { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { UserDocument } from 'src/modules/users/models/users.model';

export interface Response extends ExpressResponse {}

export interface Request extends ExpressRequest {
    user: UserDocument;
}