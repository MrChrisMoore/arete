import { mount } from '@vue/test-utils'
import VerificationPage from '../verification.page';

describe('VerificationPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(VerificationPage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})