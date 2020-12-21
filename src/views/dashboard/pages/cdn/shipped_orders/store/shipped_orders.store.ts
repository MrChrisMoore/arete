import { shippedOrdersGetters } from  './shipped_orders.getters';
import { shippedOrdersMutationsMap } from  './shipped_orders.mutations';
import { shippedOrdersActionsMap } from './shipped_orders.actions';

export interface ShippedOrdersState {

}

export const shippedOrdersState: ShippedOrdersState = {

};

export const shippedOrdersStore = {
  state: shippedOrdersState,
  getters: {...shippedOrdersGetters},
  actions: { ...shippedOrdersActionsMap },
  mutations: { ...shippedOrdersMutationsMap },
}

