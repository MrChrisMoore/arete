import { changeGetters } from  './change.getters';
import { changeMutationsMap } from  './change.mutations';
import { changeActionsMap } from './change.actions';

export interface ChangeState {

}

export const changeState: ChangeState = {

};

export const changeStore = {
  state: changeState,
  getters: {...changeGetters},
  actions: { ...changeActionsMap },
  mutations: { ...changeMutationsMap },
}

