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
 * @interface PickupRange
 */
export interface PickupRange {
    /**
     * 
     * @type {string}
     * @memberof PickupRange
     */
    start?: string;
    /**
     * 
     * @type {string}
     * @memberof PickupRange
     */
    end?: string;
}

export function PickupRangeFromJSON(json: any): PickupRange {
    return PickupRangeFromJSONTyped(json, false);
}

export function PickupRangeFromJSONTyped(json: any, ignoreDiscriminator: boolean): PickupRange {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start': !exists(json, 'start') ? undefined : json['start'],
        'end': !exists(json, 'end') ? undefined : json['end'],
    };
}

export function PickupRangeToJSON(value?: PickupRange | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'start': value.start,
        'end': value.end,
    };
}


