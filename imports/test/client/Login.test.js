import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import Login from './../../ui/Login';

if (Meteor.isClient) {
  describe('Login', function () {
    it('should set button text to logout', function () {
      const wrapper = mount( <Login /> )
      const buttonText = wrapper.find('button').text();

      expect(buttonText).toBe('Login');
    });

    it('should set link text to signup', function () {
      const wrapper = mount( <Login /> )
      const signUpLink = wrapper.find('a').text();

      expect(signUpLink).toBe('Signup for an account?');
    });

    it('should use title prop as h1 text', function () {
      const title = 'Game Challenge';
      const wrapper = mount( <Login /> );
      const actualTitle = wrapper.find('h1').text();

      expect(actualTitle).toBe(title);
    });


    it('should show error messages', function () {
      const error = 'This is not working';
      const wrapper = mount(<Login loginWithPassword={() => {}}/>);

      wrapper.setState({ error });
      expect(wrapper.find('p').text()).toBe(error);

      wrapper.setState({ error: '' });
      expect(wrapper.find('p').length).toBe(0);
    });


    it('should call loginWithPassword with the form data', function () {
      const email = 'Yar@test.com';
      const password = 'password123';
      const spy = expect.createSpy();
      const wrapper = mount(<Login loginWithPassword={spy}/>);

      wrapper.ref('email').node.value = email;
      wrapper.ref('password').node.value = password;
      wrapper.find('form').simulate('submit');

      expect(spy.calls[0].arguments[0]).toEqual({ email });
      expect(spy.calls[0].arguments[1]).toBe(password);
    });

  });
}
