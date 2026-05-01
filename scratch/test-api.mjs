fetch('http://localhost:3000/api/test-db')
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
