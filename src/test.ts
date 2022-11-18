import Collection from './Collection';
import Database from './index';

(function () {
  const database = new Database('test');

  database.addCollection('people');
  const people = database.getCollection('people');

  if (people === undefined) {
    throw new Error("Collection doesn't exists");
  }

  console.log(database, database['name']);
  console.log(people);
  // console.log(database.getCollection())

  if (people instanceof Collection) {
    console.log(people.name);
  }

  const key = 1;
  const value = {
    name: 'Gabriel',
  };

  people.set(key, value);

  console.log(people.get(key));

  database.deleteCollection(people.name);

  console.log(people);
})();
