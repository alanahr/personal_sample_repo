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

// #todo add tasks/goals/entries with relationship field(s) and use graph query 
db.createCollection("entries_collection");
db.default_db_collection.insertMany([
  {
    _uuid: "474457b6-aa23-4e06-ae05-42f76ce4610e",
    heading: "test note",
    is_task: false,
    is_done: false,
    date_done: "work out date format",
    editor_content: "still figuring out which to use quill or tiptap",
    created_date: "February 7, 2025",
  },
  {
    _uuid: "8676c47e-56d5-48b7-b4bf-bbb2d26c59d9",
    heading: "",
    is_task: true,
    is_done: false,
    date_done: "work out date format",
    editor_content: "do a thing",
    created_date: "February 8, 2025",
    parent: "474457b6-aa23-4e06-ae05-42f76ce4610e"
  },
  {
    _uuid: "424d5473-b5f3-43f6-9f79-09e82bc26b9d",
    heading: "",
    is_task: true,
    is_done: false,
    date_done: "work out date format",
    editor_content: "do another thing",
    created_date: "February 8, 2025",
    parent: "474457b6-aa23-4e06-ae05-42f76ce4610e"
  }
]);

db.createCollection("default_db_collection");
db.default_db_collection.insertMany([
      {
        _id: "0",
        title: "test note",
        content: "some text here",
        created_date: "February 7, 2025"
      },
      {
        _id: "1",
        title: "test note 2",
        content: "some text here",
        created_date: "February 8, 2025"
      },
      {
        _id: "3",
        title: "test note",
        content: "some text here",
        created_date: "February 7, 2024"
      },
      {
        _id: "4",
        title: "test note 2",
        content: "some text here",
        created_date: "February 8, 2024"
      }
]);
