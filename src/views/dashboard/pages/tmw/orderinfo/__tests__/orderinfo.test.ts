import { mount } from '@vue/test-utils'
import OrderinfoPage from '../orderinfo.page';

describe('OrderinfoPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(OrderinfoPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})