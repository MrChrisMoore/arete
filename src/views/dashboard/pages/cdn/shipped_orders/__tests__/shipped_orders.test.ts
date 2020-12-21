import { mount } from '@vue/test-utils'
import ShippedOrdersPage from '../shipped_orders.page';

describe('ShippedOrdersPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ShippedOrdersPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})