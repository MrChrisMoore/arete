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
 * @interface DateRange
 */
export interface DateRange {
    /**
     * 
     * @type {string}
     * @memberof DateRange
     */
    start?: string;
    /**
     * 
     * @type {string}
     * @memberof DateRange
     */
    end?: string;
}

export function DateRangeFromJSON(json: any): DateRange {
    return DateRangeFromJSONTyped(json, false);
}

export function DateRangeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DateRange {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start': !exists(json, 'start') ? undefined : json['start'],
        'end': !exists(json, 'end') ? undefined : json['end'],
    };
}

export function DateRangeToJSON(value?: DateRange | null): any {
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


