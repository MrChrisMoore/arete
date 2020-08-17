import { inventoryGetters } from  './inventory.getters';
import { inventoryMutationsMap } from  './inventory.mutations';
import { inventoryActionsMap } from './inventory.actions';

export interface InventoryState {

}

export const inventoryState: InventoryState = {

};

export const inventoryStore = {
  state: inventoryState,
  getters: {...inventoryGetters},
  actions: { ...inventoryActionsMap },
  mutations: { ...inventoryMutationsMap },
}

