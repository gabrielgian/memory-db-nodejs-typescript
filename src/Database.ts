import { open } from 'node:fs/promises';
import { Stream } from 'node:stream';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import mixin from 'merge-descriptors';
import { JsonStreamStringify } from 'json-stream-stringify';

import Collection, { CollectionNameType } from './Collection';
class Database {
  name: string;
  collections: Map<string, Collection>;
  backups: Array<string>;

  /**
   * Creates a new database with a specified name
   *
   * @param {string}  name  the name to be used to create database
   * */
  constructor(name: string) {
    this.name = name;
    this.collections = new Map();
    this.backups = [];
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
   *
   * @returns Returns an iterator for all collections in the order they were added
   */
  getCollections(): IterableIterator<Collection> {
    return this.collections.values();
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

  /**
   * Creates a backup and save it to a json file. This task is performed by a worker.
   *
   * @param backupFileName backup file name (default: {@link Database.generateNewBackupFileName})
   * @returns Returns a Promise that will resolve true if the backup was created
   */
  async backup(backupFileName: string = this.generateNewBackupFileName()): Promise<boolean> {
    return new Promise((resolve) => {
      const workerData = { db: this, backupFileName };
      const worker = new Worker(__filename, { workerData });
      worker.on('exit', (code) => {
        if (code === 0) {
          this.backups.push(backupFileName);
        }

        resolve(code === 0);
      });
    });
  }

  /**
   * Save the backup into a json file.
   *
   * @param backupFileName backup file name
   * @returns Returns a Promise that will resolve true if the backup was created
   */
  private async save(backupFileName: string): Promise<void> {
    const getCollectionStream = function* (collections: Map<string, Collection>) {
      // eslint-disable-next-line no-loops/no-loops
      for (const [, collection] of collections) {
        yield new JsonStreamStringify({
          name: collection.name,
          values: Stream.Readable.from(collection.values, { objectMode: true }),
        });
      }
    };

    const fd = await open(backupFileName, 'w');

    const databaseJson = new JsonStreamStringify({
      name: this.name,
      collections: Stream.Readable.from(getCollectionStream(this.collections), { objectMode: true }),
    });

    databaseJson.pipe(fd.createWriteStream());

    return new Promise((resolve) => databaseJson.on('close', () => resolve()));
  }

  /**
   * @returns Returns a default backup name using new Date()
   */
  private generateNewBackupFileName(): string {
    return `./${this.name}_${new Date().toISOString()}.json`;
  }
}

if (!isMainThread) {
  const { db, backupFileName } = workerData;

  mixin(db, Database.prototype, false);

  db.save(backupFileName);
}

export default Database;
