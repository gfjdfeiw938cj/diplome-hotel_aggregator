conn = new Mongo();
db = conn.getDB('test');

db.users.insert({
  email: 'admin@mail.ru',
  password: '$2b$10$wLbIEG9BAKHm4vCEcMXcpu05Ev7zlFwbF03sFKO88w7K/6rELrNJ6',
  name: 'Admin',
  role: 'admin',
});
