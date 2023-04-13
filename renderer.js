const fetchPhotos = async (page) => {
  const url = `https://api.unsplash.com/photos?client_id=a5kZK1xnReMJmJHrO9nUFU2JQ6h_CcD9vJUnhCRdz7I&page=${page}&per_page=20`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const renderPhotos = (photos) => {
  const grid = document.getElementById("grid");
  const addedIds = Array.from(grid.children).map((img) => img.dataset.id);
  photos.forEach((photo) => {
    const identifier = photo.id + photo.created_at;
    if (addedIds.includes(identifier)) {
      return;
    }
    const a = document.createElement("a");
    a.href = photo.links.html;
    a.target = "_blank"; // open link in a new tab
    const img = document.createElement("img");
    img.src = photo.urls.regular;
    img.dataset.id = identifier;

    a.appendChild(img);
    grid.appendChild(a);
    addedIds.push(identifier);
    img.onload = () => {
      masonry(grid, img);
    };
  });
};

const masonry = (container, item) => {
  const rowGap = parseInt(
    window.getComputedStyle(container).getPropertyValue("grid-row-gap")
  );
  const rowHeight = parseInt(
    window.getComputedStyle(container).getPropertyValue("grid-auto-rows")
  );
  const rowSpan = Math.ceil(
    (item.offsetHeight + rowGap) / (rowHeight + rowGap)
  );
  item.style.gridRowEnd = "span " + rowSpan;
};

let currentPage = 1;
let isLoading = false;
const loadedUrls = [];

const loadMorePhotos = async () => {
  if (isLoading) return;
  isLoading = true;
  const photos = await fetchPhotos(currentPage);
  const newPhotos = photos.filter(
    (photo) => !loadedUrls.includes(photo.urls.regular)
  );
  renderPhotos(newPhotos);
  newPhotos.forEach((photo) => loadedUrls.push(photo.urls.regular)); // add new URLs to loadedUrls array
  currentPage++;
  console.log(currentPage);
  console.log("Scroll position:", window.scrollY);
  isLoading = false;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadMorePhotos();
      }
    });
  },
  { threshold: 0 }
);

(async () => {
  const photos = await fetchPhotos(currentPage);
  renderPhotos(photos);
  photos.forEach((photo) => loadedUrls.push(photo.urls.regular)); // add initial URLs to loadedUrls array
  currentPage++;

  observer.observe(document.getElementById("sentinel"));

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;
    const middleOfPage = (windowHeight + scrollPosition) / 2;

    if (middleOfPage >= documentHeight / 2) {
      loadMorePhotos();
    }
  });
})();

function scrollToTopOfGrid() {
  const grid = document.getElementById("grid");
  const gridRect = grid.getBoundingClientRect();
  const gridTop = gridRect.top + window.pageYOffset;
  const offset = 20; // Additional offset in pixels
  window.scrollTo(8, gridTop - offset);
}

const scrollToTopBtn = document.querySelector("#scroll-to-top");

scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
