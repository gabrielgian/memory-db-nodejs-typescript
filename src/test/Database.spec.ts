import { expect } from 'chai';
import 'mocha';
import Collection from '../Collection';
import Database from '../Database';

describe('Testing Database methods', () => {
  const name = 'dbname';
  const collectionName = 'people';
  const collectionName2 = 'pet';

  it('should create database and initialize it with params', () => {
    const database = new Database(name);

    expect(database).to.be.instanceof(Database, 'constructor should return a Database instance');
    expect(database.name).to.equal(name), 'database name is incorrect';
    expect(database.collections).to.be.a('Map', 'collections not initialized properly');
  });

  it('should add and return a new collection', () => {
    const database = new Database(name);

    const collection = database.addCollection(collectionName);
    const collection2 = database.addCollection(collectionName2);
    const returnedCollection = database.getCollection(collectionName);

    expect(collection).to.be.instanceof(Collection);
    expect(collection2).to.be.instanceof(Collection);
    expect(returnedCollection).to.be.equal(collection);
  });

  it('should return a pre-existed collection when trying to add with a used name', () => {
    const database = new Database(name);

    const collection = database.addCollection(collectionName);
    const returnedCollection = database.addCollection(collectionName);

    expect(collection).to.equal(returnedCollection);
  });

  it('should succesfully delete a collection', () => {
    const database = new Database(name);

    database.addCollection(collectionName);
    const deleteReturn = database.deleteCollection(collectionName);
    const returnedCollection = database.getCollection(collectionName);

    expect(deleteReturn).to.be.true;
    expect(returnedCollection).to.be.undefined;
  });

  it('should return false when deleting a non-existing collection', () => {
    const database = new Database(name);

    database.addCollection(collectionName);
    const deleteReturn = database.deleteCollection(collectionName);
    const deleteReturn2 = database.deleteCollection(collectionName);

    expect(deleteReturn).to.be.true;
    expect(deleteReturn2).to.be.false;
  });

  it('should return an iterator for all collections in the order they were added', () => {
    const database = new Database(name);

    const collection = database.addCollection(collectionName);
    const collection2 = database.addCollection(collectionName2);

    const [returnedCollection, returnedCollection2] = database.getCollections();

    expect(returnedCollection).to.equal(collection);
    expect(returnedCollection2).to.equal(collection2);
  });
});
