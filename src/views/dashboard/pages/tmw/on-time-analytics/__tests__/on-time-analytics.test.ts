import { mount } from '@vue/test-utils'
import OnTimeAnalytics from '../on-time-analytics';

describe('OnTimeAnalytics', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(OnTimeAnalytics)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})