import { expect } from 'chai';
import 'mocha';
import Collection from '../Collection';

describe('Testing Collection methods', () => {
  const key = 'key';
  const key2 = 'key2';
  const value = { prop: 1 };
  const value2 = { prop: 2 };

  it('should create collection and initialize it with params', () => {
    const collection = new Collection('people');

    expect(collection).to.be.instanceof(Collection, 'constructor should return a Collection instance');
    expect(collection.name).to.equal('people', 'collection name is incorrect');
    expect(collection.values).to.be.a('Map', 'values not initialized properly');
  });

  it('should set and get a new record', () => {
    const collection = new Collection('people');

    collection.set(key, value);
    const getValue = collection.get(key);

    expect(collection.size()).to.equal(1);
    expect(getValue).to.be.equal(value);
  });

  it('should set a new value to a pre-existed record', () => {
    const collection = new Collection('people');

    collection.set(key, value);
    collection.set(key, value2);
    const getValue = collection.get(key);

    expect(getValue).to.not.be.equal(value);
    expect(getValue).to.be.equal(value2);
  });

  it('should succesfully delete a value and return undefined when trying to get it', () => {
    const collection = new Collection('people');

    collection.set(key, value);
    const deleteReturn = collection.delete(key);
    const getValue = collection.get(key);

    expect(deleteReturn).to.be.true;
    expect(getValue).to.be.undefined;
  });

  it('should return false when deleting a non-existing key', () => {
    const collection = new Collection('people');

    const deleteReturn = collection.delete(key);

    expect(deleteReturn).to.be.false;
  });

  it('should return clear all records', () => {
    const collection = new Collection('people');

    collection.set(key, value);
    collection.set(key2, value2);

    collection.clear();

    expect(collection.size()).to.equal(0);
  });

  it('should throw an exception when invoking any method after destroy', () => {
    const collection = new Collection('people');

    collection.destroy();

    expect(() => collection.clear()).to.throw(ReferenceError);
    expect(() => collection.set(key, value)).to.throw(ReferenceError);
    expect(() => collection.get(key)).to.throw(ReferenceError);
    expect(() => collection.delete(key)).to.throw(ReferenceError);
    expect(() => collection.size()).to.throw(ReferenceError);
    expect(() => collection.destroy()).to.throw(ReferenceError);
  });
});
