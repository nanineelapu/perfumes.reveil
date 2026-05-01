fetch('http://localhost:3000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        reviewer_name: 'Test Name',
        rating: 5,
        comment: 'This is a test comment',
        product_id: '',
        is_featured: true,
        source: 'google'
    })
})
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
