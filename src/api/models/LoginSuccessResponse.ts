/* tslint:disable */
/* eslint-disable */
/**
 * FST Data Access API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: V1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    UserJson,
    UserJsonFromJSON,
    UserJsonFromJSONTyped,
    UserJsonToJSON,
} from './';

/**
 * 
 * @export
 * @interface LoginSuccessResponse
 */
export interface LoginSuccessResponse {
    /**
     * 
     * @type {string}
     * @memberof LoginSuccessResponse
     */
    token?: string;
    /**
     * 
     * @type {UserJson}
     * @memberof LoginSuccessResponse
     */
    userJson?: UserJson;
}

export function LoginSuccessResponseFromJSON(json: any): LoginSuccessResponse {
    return LoginSuccessResponseFromJSONTyped(json, false);
}

export function LoginSuccessResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginSuccessResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'token': !exists(json, 'token') ? undefined : json['token'],
        'userJson': !exists(json, 'userJson') ? undefined : UserJsonFromJSON(json['userJson']),
    };
}

export function LoginSuccessResponseToJSON(value?: LoginSuccessResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'token': value.token,
        'userJson': UserJsonToJSON(value.userJson),
    };
}

