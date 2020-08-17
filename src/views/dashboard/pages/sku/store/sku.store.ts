import { skuGetters } from  './sku.getters';
import { skuMutationsMap } from  './sku.mutations';
import { skuActionsMap } from './sku.actions';

export interface SkuState {

}

export const skuState: SkuState = {

};

export const skuStore = {
  state: skuState,
  getters: {...skuGetters},
  actions: { ...skuActionsMap },
  mutations: { ...skuMutationsMap },
}

