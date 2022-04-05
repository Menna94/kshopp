// Uncomment these imports to begin using these cool features!

import {get} from '@loopback/rest';

// import {inject} from '@loopback/core';

export class HelloController {
  constructor() {}
  @get('/h')
  say(): string {
    return 'Hello From LB4';
  }
}
