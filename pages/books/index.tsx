import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Book {
  id: number;
  title: string;
  description: string;
  image_url : string;
  release_year: number;
  price : string;
  total_page : number;
  thickness : string;
  createdAt : string;
  updatedAt : string;
  category_id : string;
  category: {
    name: string;
  };
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    minYear: "",
    maxYear: "",
    minPage: "",
    maxPage: "",
    sortByTitle: "",
  });
  const router = useRouter();

  function editBook(id : number) {
    router.push(`/book/${id}`);
  }

  function deleteBook (id : number) {
    axios.delete(`/api/book/${id}`)
    .then((res) => {
      console.log(res);
      
      Swal.fire({
        title: "Success",
        text: "Book successfully deleted",
        icon: "success"
      });

      axios.get("/api/books")
        .then(response => {
          setBooks(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });

    })
    .catch((err) => {
      Swal.fire({
        title: "Error",
        text: err.response.data.error,
        icon: "error"
      });
    })
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const applyFilters = () => {
    setLoading(true);

    axios
      .get("/api/books", {
        params: filters,
      })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    axios.get("/api/books")
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <p>Show Books</p>
      <button onClick={() => router.push('/book')}>Add Book</button>
      <br />
      <input
          type="text"
          placeholder="Title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Year"
          name="minYear"
          value={filters.minYear}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Year"
          name="maxYear"
          value={filters.maxYear}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Page"
          name="minPage"
          value={filters.minPage}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Page"
          name="maxPage"
          value={filters.maxPage}
          onChange={handleFilterChange}
        />
        <select
          name="sortByTitle"
          value={filters.sortByTitle}
          onChange={handleFilterChange}
        >
          <option value="" selected disabled>Sort By Title</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={applyFilters}>Apply Filters</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="table-auto">
            <thead>
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Description</th>
                <th>Release Year</th>
                <th>Total Page</th>
                <th>Thickness</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td><img src={book.image_url}/></td>
                  <td>{book.description}</td>
                  <td>{book.release_year}</td>
                  <td>{book.total_page}</td>
                  <td>{book.thickness}</td>
                  <td>{book.category.name}</td>
                  <td>
                      <button onClick={() => editBook(book.id)}>Edit</button>
                      <button onClick={() => deleteBook(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
