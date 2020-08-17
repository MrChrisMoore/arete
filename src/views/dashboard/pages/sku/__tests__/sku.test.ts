import { mount } from '@vue/test-utils'
import SkuPage from '../sku.page';

describe('SkuPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(SkuPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})