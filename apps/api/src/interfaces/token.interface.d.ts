import { AccessToken, RefreshToken } from './token.interface.d';
/**
 * Base interface for other tokens
 */
export interface BaseToken {
    sub: string; // store user identifier here
    deviceId: string;
}

export interface AccessToken extends BaseToken {}
export interface RefreshToken extends BaseToken {
    version: number;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string
}