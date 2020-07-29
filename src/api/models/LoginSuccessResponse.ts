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
     * @type {object}
     * @memberof LoginSuccessResponse
     */
    verification?: object;
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
        'verification': !exists(json, 'verification') ? undefined : json['verification'],
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
        'verification': value.verification,
    };
}


