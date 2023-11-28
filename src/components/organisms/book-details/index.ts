interface Book {
  title: string;
  cover_i: number;
  key: string;
  isbn: string[];
}

interface BookData {
  bib_key: string;
  details: {
    key: string;
    covers: string[];
    authors: { name: string }[];
    title: string;
    sub_title: string;
    full_title: string;
    publishers: string[];
    pagination: string;
    publish_date: string;
  };
  info_url: string;
  preview_url: string;
}

export { type Book, type BookData };
