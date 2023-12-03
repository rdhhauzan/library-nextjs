import { useState, useRef, FormEvent, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import "../../app/globals.css";

interface FormValues {
  username: string;
  password: string;
}

interface ApiResponse {
  message: String;
  access_token: any;
  user_id: any;
}

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const login = async (e: FormEvent) => {
    Swal.fire({
      title: "Logging...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setLoading(true);
    e.preventDefault();

    const formValues: FormValues = {
      username,
      password,
    };

    console.log(formValues);

    axios.post<ApiResponse>("/api/login", formValues)
      .then(response => {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user_id", response.data.user_id);
        Swal.fire({
          title: "Success",
          text: "Login success, redirect you to dashboard...",
          icon: "success"
        });
        router.push('/books');
      })
      .catch(error => {
        Swal.fire({
          title: "Login failed",
          text: error.response.data.message,
          icon: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      router.push('/books')
    }
  }, [])

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900">Sign in to your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" ref={formRef}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-white-900">Username</label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white-900">Password</label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={login}
            >
              Sign in
            </button>
            <a onClick={() => router.push('/register')} className="cursor-pointer">Dont have an account? Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
}