import { Button, Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState('')

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg('')
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMsg("Error while FETCHING images. Try again later.")
      console.log(error)
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    resetSearch();
  };
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };
  return (
    <div className="container">
      <h1 className="title">Riseupp Icon</h1>
      {errorMsg && 
        <p className="error-msg">{errorMsg}</p>
      }
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("mountains")}>Mountains</div>
        <div onClick={() => handleSelection("flowers")}>Flowers</div>
        <div onClick={() => handleSelection("beaches")}>Beaches</div>
        <div onClick={() => handleSelection("cities")}>Cities</div>
      </div>
      <div className="images">
        {images.map((image) => {
          return (
            <img
              key={image.id}
              src={image.urls.regular}
              alt={image.alt_description}
              className="image"
            />
          );
        })}
      </div>
      <div className="buttons">
        {page > 1 && (
          <Button onClick={() => setPage(page - 1)}>Previous</Button>
        )}
        {page < totalPages && (
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}

export default App;
