import { mount } from '@vue/test-utils'
import ChangePage from '../change.page';

describe('ChangePage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ChangePage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})