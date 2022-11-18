export type CollectionNameType = string;

export type CollectionKeyType = string | number;

export type CollectionValueType = object;

class Collection {
  name: CollectionNameType;
  values: Map<CollectionKeyType, CollectionValueType>;
  private deleted: boolean;

  /**
   * Creates a new collection
   *
   * @param {CollectionNameType}  name  the name to be used to create collection
   * */
  constructor(name: CollectionNameType) {
    this.name = name;
    this.values = new Map();
    this.deleted = false;
  }

  assertExistance(): void {
    if (this.deleted) {
      throw new Error('Collection has been deleted.');
    }
  }

  /**
   * Set value referenced by a key. Overrides the value if the key exists.
   *
   * @param key key to reference value
   * @param value value referenced by key
   * @returns Returns true if succeed, false otherwise.
   */
  set(key: CollectionKeyType, value: CollectionValueType): boolean {
    this.assertExistance();

    this.values.set(key, value);

    return true;
  }

  /**
   * Get value referenced by a key.
   *
   * @param key key to get value
   * @returns Returns the value referenced by key.
   *  If key doesn't exists, returns undefined.
   */
  get(key: CollectionKeyType): CollectionValueType | undefined {
    this.assertExistance();

    return this.values.get(key);
  }

  /**
   * Deletes a key/value from collection
   *
   * @param key key to be deleted
   * @returns Returns true if the key existed and has been deleted,
   *  or false if the key does not exist.
   */
  delete(key: CollectionKeyType): boolean {
    this.assertExistance();

    return this.values.delete(key);
  }

  /**
   * Clear all key and values from collection
   */
  clear(): void {
    this.assertExistance();

    this.values.clear();
  }

  /**
   * Clear all key and values from collection and soft-delete it
   */
  destroy(): void {
    this.assertExistance();

    this.clear();

    this.deleted = true;
  }
}

export default Collection;
