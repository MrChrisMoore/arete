import { mount } from '@vue/test-utils'
import SingleOrderPage from '../single_order.page';

describe('SingleOrderPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(SingleOrderPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})