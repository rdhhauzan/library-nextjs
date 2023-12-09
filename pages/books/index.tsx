import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../../app/globals.css";
import store from "@/store/Store";
import { observer } from "mobx-react";

const Books: React.FC = () => {
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
    store.deleteBook(id, () => {
      return true;
    })
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const applyFilters = () => {
    store.fetchBooks(filters)
  };

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/login')
    }

    store.fetchBooks();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="my-5 text-center" style={{fontSize: "30px"}}>Book Lists</h1>
      <button onClick={() => router.push('/book')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3">Add Book</button>
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
        <button onClick={applyFilters} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">Apply Filters</button>
      {store.loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="table-auto shadow-lg bg-white content-top mt-3 border-collapse" width="100%">
            <thead>
              <tr>
                <th className="bg-blue-100 border text-left px-8 py-4">Title</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Image</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Description</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Release Year</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Total Page</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Thickness</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Category</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {store.books.map(book => (
                <tr key={book.id} className="hover:bg-gray-50 focus:bg-gray-300">
                  <td className="border px-8 py-4">{book.title}</td>
                  <td className="border px-8 py-4"><img src={book.image_url}/></td>
                  <td className="border px-8 py-4">{book.description}</td>
                  <td className="border px-8 py-4">{book.release_year}</td>
                  <td className="border px-8 py-4">{book.total_page}</td>
                  <td className="border px-8 py-4">{book.thickness}</td>
                  <td className="border px-8 py-4">{book.category.name}</td>
                  <td className="border px-8 py-4">
                      <button onClick={() => editBook(book.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded m-3">Edit</button>
                      <button onClick={() => deleteBook(book.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-3">Delete</button>
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

export default observer(Books);
