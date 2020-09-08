import { ordersGetters } from  './orders.getters';
import { ordersMutationsMap } from  './orders.mutations';
import { ordersActionsMap } from './orders.actions';

export interface OrdersState {

}

export const ordersState: OrdersState = {

};

export const ordersStore = {
  state: ordersState,
  getters: {...ordersGetters},
  actions: { ...ordersActionsMap },
  mutations: { ...ordersMutationsMap },
}

