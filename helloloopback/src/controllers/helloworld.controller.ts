// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {get} from '@loopback/rest'


export class HellowordController {
  @get('/helloworld')
  hello(): string{
    return "Hello World"
  }
}
