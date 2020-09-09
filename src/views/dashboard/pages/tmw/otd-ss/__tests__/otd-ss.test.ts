import { mount } from '@vue/test-utils'
import OtdSsPage from '../otd-ss.page';

describe('OtdSsPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(OtdSsPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})