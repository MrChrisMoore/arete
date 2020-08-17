import { verificationGetters } from  './verification.getters';
import { verificationMutationsMap } from  './verification.mutations';
import { verificationActionsMap } from './verification.actions';

export interface VerificationState {

}

export const verificationState: VerificationState = {

};

export const verificationStore = {
  state: verificationState,
  getters: {...verificationGetters},
  actions: { ...verificationActionsMap },
  mutations: { ...verificationMutationsMap },
}

