import { Fetch } from "components/atoms/fetch/fetch";
import { Book, BookList } from "components/organisms/book-list";
import { useState, MouseEvent } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as Realm from "realm-web";

interface SearchResponse {
  docs: Book[];
  numFound: number;
}

const SignupSchema = Yup.object().shape({
  bookName: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

interface LoginProps {
  setUser: (user: Realm.User) => void;
}

interface LogOutProps {
  user: Realm.User;
  setUser: (user: Realm.User | null) => void;
}

const Login = ({ setUser }: LoginProps) => {
  const loginGoogle = async () => {
    const user: Realm.User = await app.logIn(
      Realm.Credentials.google({
        redirectUrl: "http://localhost:3000/auth.html",
      })
    );
    setUser(user);
  };
  return (
    <button
      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105"
      onClick={loginGoogle}
    >
      Log In With Google
    </button>
  );
};

const LogOut = ({ user, setUser }: LogOutProps) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (user !== null && app.currentUser) {
      app.currentUser.logOut();
      setUser(null);
    }
  };
  return (
    <button
      className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 transform hover:scale-105"
      onClick={handleClick}
    >
      Log Out
    </button>
  );
};

const UserDetail = ({ user }: { user: Realm.User }) => {
  window.console.log("User", user);

  return (
    <div className="text-center p-8 bg-pastel-light-green">
      <p className="text-gray-600 mb-2">
        <span className="font-semibold text-yellow-500 border-b-2 border-yellow-500 pb-1">
          Logged in with user id:
        </span>
        <span className="text-xl text-yellow-500 ml-2">{user.id}</span>
      </p>
      <br></br>
      <div className="flex justify-center space-x-4 text-white">
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full shadow-md hover:from-orange-500 hover:to-yellow-400 hover:shadow-lg">
            {user.profile.firstName}
          </span>
        </h2>
        <h2 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 px-4 py-2 rounded-full shadow-md hover:from-indigo-500 hover:to-blue-400 hover:shadow-lg">
            {user.profile.lastName}
          </span>
        </h2>
      </div>
    </div>
  );
};

const app = new Realm.App({ id: "application-0-cghoq" });

function App() {
  const [searchUri, setSearchUri] = useState<string | null>(null);
  const [user, setUser] = useState<Realm.User | null>(app.currentUser);

  return (
    <div className="bg-pastel-light-green p-8 text-black font-mono">
      <div>
        {user ? <UserDetail user={user} /> : <Login setUser={setUser} />}
      </div>
      <div className="flex min-h-[60vh] flex-col items-center justify-start gap-4 mt-20 text-center relative">
        <div className="w-4/5 bg-white rounded-lg p-6 shadow-md transform -translate-y-4 transition-transform duration-300 hover:scale-105">
          <Formik
            initialValues={{ bookName: "" }}
            validationSchema={SignupSchema}
            onSubmit={async (values) => {
              const encodedBookName = encodeURIComponent(values.bookName);
              const searchUrl = `https://openlibrary.org/search.json?q=${encodedBookName}`;
              setSearchUri(searchUrl);
            }}
          >
            <Form>
              <div className="flex">
                <Field
                  type="text"
                  name="bookName"
                  className="bg-gradient-to-r from-pink-300 to-blue-300 border border-gray-300 text-white font-extralight rounded-md focus:ring-pink-500 focus:border-pink-500 block w-3/4 mx-auto p-3 shadow-md transform transition-transform duration-300 hover:scale-105 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500"
                  placeholder="Book Name"
                />
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg font-extralight text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
                >
                  Search
                </button>
              </div>
              <br></br>
              <ErrorMessage
                name="bookName"
                component="div"
                className="text-white font-extrabold text-xl bg-gradient-to-r from-red-600 to-pink-500 py-2 px-4 rounded-md shadow-md transform -translate-y-2 transition-transform duration-300 hover:scale-105"
              />
            </Form>
          </Formik>

          <div className="flex">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Fetch<SearchResponse>
                uri={searchUri}
                renderData={(data) => (
                  <div className="flex flex-col w-full">
                    <br></br>
                    <div>Found {data.numFound} books</div>
                    <br></br>
                    <BookList books={data.docs} />
                  </div>
                )}
              ></Fetch>
            </ErrorBoundary>
            <div className="pl-4">
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Outlet />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {user ? <LogOut setUser={setUser} user={user} /> : <></>}
    </div>
  );
}

export default App;
