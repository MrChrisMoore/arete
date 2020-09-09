import { accessorialsGetters } from  './accessorials.getters';
import { accessorialsMutationsMap } from  './accessorials.mutations';
import { accessorialsActionsMap } from './accessorials.actions';

export interface AccessorialsState {

}

export const accessorialsState: AccessorialsState = {

};

export const accessorialsStore = {
  state: accessorialsState,
  getters: {...accessorialsGetters},
  actions: { ...accessorialsActionsMap },
  mutations: { ...accessorialsMutationsMap },
}

