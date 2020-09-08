import { mount } from '@vue/test-utils'
import OrdersPage from '../orders.page';

describe('OrdersPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(OrdersPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})