import { onTimeAnalyticsGetters } from  './on-time-analytics.getters';
import { onTimeAnalyticsMutationsMap } from  './on-time-analytics.mutations';
import { onTimeAnalyticsActionsMap } from './on-time-analytics.actions';

export interface OnTimeAnalyticsState {

}

export const onTimeAnalyticsState: OnTimeAnalyticsState = {

};

export const onTimeAnalyticsStore = {
  state: onTimeAnalyticsState,
  getters: {...onTimeAnalyticsGetters},
  actions: { ...onTimeAnalyticsActionsMap },
  mutations: { ...onTimeAnalyticsMutationsMap },
}

