import { LoaderFunction, useLoaderData } from "react-router-dom";
import { BookData } from ".";

const bookLoader: LoaderFunction = async ({
  params,
}): Promise<{ book: BookData | null }> => {
  const fetchUri = `https://openlibrary.org/api/books?bibkeys=ISBN:${params.isbn}&jscmd=details&format=json`;
  const response = await fetch(fetchUri);
  if (!response.ok) {
    return { book: null };
  }
  const json = await response.json();
  const keys = Object.keys(json);
  const isbn = keys[0];
  const book = json[isbn];

  window.console.log("Book details", book);
  return { book };
};

const BookDetails = () => {
  const { book } = useLoaderData() as { book: BookData };
  if (book) {
    const coverId = book.details.covers ? book.details.covers[0] : null;
    let coverImage = <></>;
    if (coverId) {
      coverImage = (
        <img
          src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
          alt={book.details.title}
          className="h-full"
        />
      );
    }
    return (
      <div className="flex">
        <div className="w-1/4">{coverImage}</div>
        <div className="flex flex-col text-left pl-4">
          <div className="text-2xl">{book.details.title}</div>
          <div>Publish date: {book.details.publish_date}</div>
        </div>
      </div>
    );
  }
  return <></>;
};

export { BookDetails, bookLoader };
