import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Category {
  id: number;
  name: string;
  createdAt : string;
  updatedAt : string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function editBook(id : number) {
    router.push(`/category/${id}`);
  }

  function deleteCategory (id : number) {
    axios.delete(`/api/category/${id}`)
    .then((res) => {
      console.log(res);
      
      Swal.fire({
        title: "Success",
        text: "Category successfully deleted",
        icon: "success"
      });

      axios.get("/api/categories")
        .then(response => {
          setCategories(response.data);
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

  useEffect(() => {
    axios.get("/api/categories")
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <p>Show Categories</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={() => router.push('/category')}>Add Category</button>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                    <button onClick={() => editBook(category.id)}>Show Books with this category</button>
                    <button onClick={() => editBook(category.id)}>Edit</button>
                    <button onClick={() => deleteCategory(category.id)}>Delete</button>
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
