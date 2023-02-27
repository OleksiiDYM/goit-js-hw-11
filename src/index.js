import { createCardImg } from './createCardImg';
import { fetchSearchImage } from './fetchSearchImage';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('#search-form');
const btnLoad = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
let searchQuery = '';
let perPage = 40;

formSearch.addEventListener('submit', onSearch);
btnLoad.addEventListener('click', onButtonLoadMore);
btnLoad.style.display = 'none';

async function onSearch(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.searchQuery.value.trim();
  page = 1;

  if (!searchQuery) {
    galleryList.innerHTML = '';
    return;
  }

  try {
    const serchResponse = await fetchSearchImage(page, searchQuery);
    if (serchResponse.totalHits !== 0) {
      Notify.info(`Hooray! We found ${serchResponse.totalHits} images.`);
    }

    if (serchResponse.totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoad.style.display = 'none';
    } else {
      btnLoad.style.display = 'block';
    }

    createCardImg(serchResponse.hits);
  } catch (error) {}

  lightbox.refresh();
}

async function onButtonLoadMore() {
  page += 1;

  try {
    await fetchSearchImage(page, searchQuery).then(imgSearchFeatchMore => {
      let totalPages = imgSearchFeatchMore.totalHits / perPage;
      if (page >= totalPages) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results"
        );
        btnLoad.style.display = 'none';
      }

      createCardImg(imgSearchFeatchMore.hits);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    });
  } catch (error) {}

  lightbox.refresh();
}
