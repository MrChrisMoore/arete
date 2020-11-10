import { singleOrderGetters } from  './single_order.getters';
import { singleOrderMutationsMap } from  './single_order.mutations';
import { singleOrderActionsMap } from './single_order.actions';

export interface SingleOrderState {

}

export const singleOrderState: SingleOrderState = {

};

export const singleOrderStore = {
  state: singleOrderState,
  getters: {...singleOrderGetters},
  actions: { ...singleOrderActionsMap },
  mutations: { ...singleOrderMutationsMap },
}

