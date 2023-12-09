import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../../app/globals.css";
import store from "@/store/Store";
import { observer } from "mobx-react";

interface Category {
  id: number;
  name: string;
  createdAt : string;
  updatedAt : string;
}

const Categories: React.FC = () => {
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
    if (!localStorage.getItem('access_token')) {
        router.push('/login')
    }
    
    store.fetchCategories();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="my-5 text-center" style={{fontSize: "30px"}}>Categories Lists</h1>
      {store.loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={() => router.push('/category')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3">Add Category</button>
        <table className="table-auto shadow-lg bg-white content-top mt-3 border-collapse" width="100%">
          <thead>
            <tr>
              <th className="bg-blue-100 border text-left px-8 py-4">Category Name</th>
              <th className="bg-blue-100 border text-left px-8 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {store.categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50 focus:bg-gray-300">
                <td className="border px-8 py-4">{category.name}</td>
                <td className="border px-8 py-4">
                    <button onClick={() => router.push(`/categories/${category.id}/books`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3">Show Books with this category</button>
                    <button onClick={() => editBook(category.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded m-3">Edit</button>
                    <button onClick={() => deleteCategory(category.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-3">Delete</button>
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

export default observer(Categories);
