import { servicesOmdb } from './services-omdb';

describe('servicesOmdb', () => {
  it('should work', () => {
    expect(servicesOmdb()).toEqual('services-omdb');
  });
});
