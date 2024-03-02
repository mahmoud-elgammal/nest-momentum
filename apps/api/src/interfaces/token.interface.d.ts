import { AccessToken, RefreshToken } from './token.interface.d';
/**
 * Base interface for other tokens
 */
export interface BaseToken {
    sub: string; // store user identifier here
    version: number;
}

export interface AccessToken extends BaseToken {}
export interface RefreshToken extends BaseToken {
    device: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string
}