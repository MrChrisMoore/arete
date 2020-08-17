import { mount } from '@vue/test-utils'
import InventoryPage from '../inventory.page';

describe('InventoryPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(InventoryPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})