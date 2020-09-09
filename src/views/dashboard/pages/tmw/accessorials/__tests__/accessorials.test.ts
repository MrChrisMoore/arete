import { mount } from '@vue/test-utils'
import AccessorialsPage from '../accessorials.page';

describe('AccessorialsPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(AccessorialsPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})