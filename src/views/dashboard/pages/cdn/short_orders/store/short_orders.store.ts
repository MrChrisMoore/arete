import { shortOrdersGetters } from  './short_orders.getters';
import { shortOrdersMutationsMap } from  './short_orders.mutations';
import { shortOrdersActionsMap } from './short_orders.actions';

export interface ShortOrdersState {

}

export const shortOrdersState: ShortOrdersState = {

};

export const shortOrdersStore = {
  state: shortOrdersState,
  getters: {...shortOrdersGetters},
  actions: { ...shortOrdersActionsMap },
  mutations: { ...shortOrdersMutationsMap },
}

