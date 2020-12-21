import { mount } from '@vue/test-utils'
import ShortOrders from '../short_orders';

describe('ShortOrders', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ShortOrders)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})