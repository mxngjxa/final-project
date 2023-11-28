import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Book } from "../book-details";
import { Link } from "react-router-dom";

const renderBookRow = ({
  index,
  style,
  data,
}: ListChildComponentProps<Book[]>) => {
  const className = `flex justify-start items-center px-4 ${
    index % 2 ? "bg-gray-50" : "bg-white"
  }`;
  const title = data[index].title;
  let isbn = null;
  if (data[index].isbn) {
    isbn = data[index].isbn[0];
  }
  const cover_i = data[index].cover_i;
  const coverImageSrc = `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;
  return (
    <div className={className} style={style}>
      <div className="h-full w-[35px]">
        <img src={coverImageSrc} alt={title} className="h-full" />
      </div>
      <Link to={`books/${isbn}`}>
        <div className="pl-2">{title}</div>
      </Link>
    </div>
  );
};

interface BookListProps {
  books: Book[] | undefined;
}

const BookList = ({ books }: BookListProps) => {
  window.console.log("Book list", books);
  if (books) {
    return (
      <FixedSizeList
        className="border border-slate-300"
        height={250}
        itemCount={books.length}
        itemSize={35}
        width={300}
        itemData={books}
      >
        {/* 
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore */}
        {renderBookRow}
      </FixedSizeList>
    );
  }
  return <></>;
};

export { type Book, type BookListProps, BookList };
