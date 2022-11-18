import { expect } from 'chai';
import 'mocha';
import Database from '../Database';
import Collection from '../Collection';
import defaultDatabase, { Database as exportedDatabase, Collection as exportedCollection } from '../index';

describe('Testing index export', () => {
  it('should export Database as default', () => {
    expect(defaultDatabase).to.equal(Database);
  });
  it('should export all modules', () => {
    expect(exportedDatabase).to.equal(Database);
    expect(exportedCollection).to.equal(Collection);
  });
});
