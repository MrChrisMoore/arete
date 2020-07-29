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


import * as runtime from '../runtime';

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Just a route sitting all the way at the front
     * I don\'t really do anything.
     */
    async getRaw(): Promise<runtime.ApiResponse<string>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // jwt authentication
        }

        const response = await this.request({
            path: `/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Just a route sitting all the way at the front
     * I don\'t really do anything.
     */
    async get(): Promise<string> {
        const response = await this.getRaw();
        return await response.value();
    }

}
