fetch('http://localhost:8080')
    .then(resp => resp.json())
    .then(data => console.log(data.filter(movie => movie.name.includes('search'))))