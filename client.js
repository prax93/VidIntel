fetch('http://localhost:3000/media')
    .then(resp => resp.json())
    .then(data => console.log(data.filter(movie => movie.name.includes('search'))))