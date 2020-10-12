import { orderinfoGetters } from  './orderinfo.getters';
import { orderinfoMutationsMap } from  './orderinfo.mutations';
import { orderinfoActionsMap } from './orderinfo.actions';

export interface OrderinfoState {

}

export const orderinfoState: OrderinfoState = {

};

export const orderinfoStore = {
  state: orderinfoState,
  getters: {...orderinfoGetters},
  actions: { ...orderinfoActionsMap },
  mutations: { ...orderinfoMutationsMap },
}

