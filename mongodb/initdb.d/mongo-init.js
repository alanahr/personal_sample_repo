db = db.getSiblingDB("default_db");

db.createUser({
    user: "basic_user",
    pwd: "basic_password",
    roles: [
      {
        role: 'readWrite', 
        db: 'default_db'
      },
    ],
  });

db.createCollection("default_db_collection");

db.default_db_collection.insertMany([
  {
    note_collection_id: "1",
    grouping: "yearly",
    year: "2025",
    notes: [
      {
        note_id: "0",
        order: "1",
        title: "test note",
        content: "some text here",
        created_date: "February 7, 2025"
      },
      {
        note_id: "1",
        order: "2",
        title: "test note 2",
        content: "some text here",
        created_date: "February 8, 2025"
      },
    ],
  },
  {
    note_collection_id: "2",
    grouping: "yearly",
    year: "2024",
    notes: [
      {
        note_id: "3",
        order: "1",
        title: "test note",
        content: "some text here",
        created_date: "February 7, 2024"
      },
      {
        note_id: "4",
        order: "2",
        title: "test note 2",
        content: "some text here",
        created_date: "February 8, 2024"
      },
    ],
  }
]);