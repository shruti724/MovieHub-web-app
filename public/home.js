const apikey = "94901e26b470cc59f0598bcae9fa86ca";

const apiEndpoint = "https://api.themoviedb.org/3"; 
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query)=> `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAcWpMJgp2-RwdNeAAgfJlyG8YFGIzP_wc`
}

// boot up the app
function init(){
    // alert('hii')
    
    fetchTrendingMovies();

    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then(list=>{
        const randomIndex = parseInt(Math.random() * list.length)
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });

}

function buildBannerSection(movie) {
    // console.log(movie, "Apple")
    
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

  const div = document.createElement('div');
  div.innerHTML = `
            <h2 class="banner__title">${movie.title}</h2>
            <p class="banner__info">Trending in movies | Release Date - ${movie.release_date}</p>
            <p class="banner__overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + '...': movie.overview }</p>
            <div class="action-buttons-cont">
                <button class="action-buttons"><i class="fa-solid fa-play fa-lg" style="color: #454545;"></i>&nbsp; Play
                </button>
                <button class="action-buttons"><i class="fa-solid fa-info" style="color: #fafafa;"></i>&nbsp; More Info
                </button>
            </div>    
    `;
  div.className = "banner-content container";
  bannerCont.append(div);

}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach(category => {
          fetchAndBuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
             category.name);
        });
      }
    //   console.table(movies);
    })
    .catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl,categoryName) {
        console.log(fetchUrl,categoryName)
        return fetch(fetchUrl)
        .then(res => res.json())
        .then(res=> {
            // console.table(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length){
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err=>console.error(err))
}

function buildMoviesSection(list, categoryName){
    console.log(list, categoryName)

    const moviesCont = document.getElementById('movies-cont')

    const moviesListHTML = list.map(item=>{
        return `
        <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
        `;
    }).join('');

    const moviesSectionHTML = `
            <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
        </>
    `;


    const div = document.createElement('div');
    div.className="movies-section"
    div.innerHTML = moviesSectionHTML;

    // append html into movies container

    moviesCont.append(div);

}

function searchMovieTrailer(movieName){
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json)
    .then(res => {
        console.log(res.items[0]);
    })
    .catch(err => console.log(err));

}

window.addEventListener('load', function(){
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (this.window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})