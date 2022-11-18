import Collection, { CollectionNameType } from './Collection';

class Database {
  name: string;
  collections: Map<string, Collection>;

  /**
   * Creates a new database with a specified name
   *
   * @param {string}  name  the name to be used to create database
   * */
  constructor(name: string) {
    this.name = name;
    this.collections = new Map();
  }

  /**
   * Creates a new collection or get an pre-existing collection
   *
   * @param {CollectionNameType}  name  the name to be used to create collection
   * @return {Collection | boolean} the created or a pre-existing collection
   * */
  addCollection(name: CollectionNameType): Collection | boolean {
    if (name === null) {
      return false;
    }

    if (this.collections.has(name)) {
      return this.collections.get(name) ?? false;
    }

    const collection = new Collection(name);

    this.collections.set(name, collection);

    this.collections.get;
    return collection;
  }

  /**
   * Retrieves a collection with a given name
   *
   * @param {CollectionNameType}  name  collection's name
   * @returns {Collection | undefined} Returns the collection with the specified
   *   name. If no collection has the specified name, undefined is returned.
   * */
  getCollection(name: CollectionNameType): Collection | undefined {
    return this.collections.get(name);
  }

  /**
   * Deletes a collection from database
   *
   * @param name collection's name to be deleted
   * @returns Returns true if the collection existed and has been deleted,
   *  or false if the collection does not exist.
   */
  deleteCollection(name: CollectionNameType): boolean {
    const collection = this.collections.get(name);

    if (collection === undefined) {
      return false;
    }

    collection.destroy();

    return this.collections.delete(name);
  }
}

export default Database;
