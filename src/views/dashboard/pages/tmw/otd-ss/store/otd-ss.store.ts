import { otdSsGetters } from  './otd-ss.getters';
import { otdSsMutationsMap } from  './otd-ss.mutations';
import { otdSsActionsMap } from './otd-ss.actions';

export interface OtdSsState {

}

export const otdSsState: OtdSsState = {

};

export const otdSsStore = {
  state: otdSsState,
  getters: {...otdSsGetters},
  actions: { ...otdSsActionsMap },
  mutations: { ...otdSsMutationsMap },
}

