import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@nextui-org/react";
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { genreList, genres, languageList, languages } from "../utils/data";
import PosterSelector from "./PosterSelector";
import RichEditor from "./rich-editor";
import { parseDate } from "@internationalized/date";
import { z } from "zod";
import ErrorList from "./common/ErrorList";
import clsx from "clsx";
import { parseError } from "../utils/helper";
import toast from "react-hot-toast";

export interface initialBookToUpdate {
  id: string;
  genre: string;
  language: string;
  publicationName: string;
  publishedAt: string;
  slug: string;
  title: string;
  cover?: string;
  description: string;
  price: { mrp: string; sale: string };
}

interface Props {
  title: string;
  submitBtnTitle: string;
  initialState?: initialBookToUpdate;
  onSubmit(formDate: FormData): Promise<void>;
}

interface DefaultForm {
  file?: File | null;
  cover?: File;
  title: string;
  description: string;
  publicationName: string;
  publishedAt?: string;
  genre: string;
  language: string;
  mrp: string;
  sale: string;
}

const defaultBookInfo = {
  title: "",
  description: "",
  language: "",
  genre: "",
  publicationName: "",
  publishedAt: "",
  mrp: "",
  sale: "",
};

interface BookToSubmit {
  uploadMethod: "aws" | "local";
  title: string;
  description: string;
  language: string;
  publishedAt?: string;
  slug?: string;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  fileInfo?: {
    type: string;
    name: string;
    size: number;
  };
}

const commonBookSchema = {
  title: z.string().trim().min(5, "Title is too short"),
  description: z.string().trim().min(5, "Description is too short"),
  language: z.enum(languageList, { message: "Please select a language" }),
  genre: z.enum(genreList, { message: "Please select a genre" }),
  publicationName: z
    .string({ required_error: "Invalid publication name" })
    .trim()
    .min(3, "Publication name is too short"),
  uploadMethod: z.enum(["aws", "local"], {
    message: "Upload method is missing",
  }),
  publishedAt: z.string({ required_error: "Publish date is missing!" }).trim().min(1, "Publish date is missing!"),
  price: z
    .object({
      mrp: z
        .number({ required_error: "MRP is missing" })
        .refine((val) => val > 0, "MRP is missing"),
      sale: z
        .number({ required_error: "sale price is missing" })
        .refine((val) => val > 0, "Sale price is missing"),
    })
    .refine((price) => price.sale <= price.mrp, "Invalid sale price"),
};

const fileSchema = z.object({
  name: z
    .string({ required_error: "File name is missing" })
    .min(1, "File name is missing"),
  type: z
    .string({ required_error: "File type is missing" })
    .min(1, "File type is missing"),
  size: z
    .number({ required_error: "File size is missing" })
    .refine((val) => val > 0, "File size is missing"),
});

const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo: fileSchema,
});

const updateBookSchema = z.object({
  ...commonBookSchema,
  fileInfo: fileSchema.optional(),
});

const BookForm: FC<Props> = ({
  initialState,
  title,
  submitBtnTitle,
  onSubmit,
}) => {
  const [bookInfo, setBookInfo] = useState<DefaultForm>(defaultBookInfo);
  const [cover, setCover] = useState("");
  const [busy, setBusy] = useState(false);
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value, name } = target;
    setBookInfo({ ...bookInfo, [name]: value });
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files, name } = target;
    if (!files) return;
    const file = files[0];
    if (name === "cover") {
      try {
        setCover(URL.createObjectURL(file));
      } catch (error) {
        setCover("");
      }
    }
    setBookInfo({ ...bookInfo, [name]: file });
  };

  const handleBookPublish = async () => {
    setBusy(true);
    try {
      const formData = new FormData();
      const { file, cover } = bookInfo;
      // validate book file and cover file
      if (file?.type !== "application/epub+zip") {
        return setErrors({
          ...errors,
          file: ["Please select a valid (.epub) file."],
        });
      } else {
        setErrors({ ...errors, file: undefined });
      }

      if (cover && !cover?.type.startsWith("image/")) {
        return setErrors({
          ...errors,
          cover: ["Please select a valid poster file"],
        });
      } else {
        setErrors({ ...errors, cover: undefined });
      }

      if (cover) {
        formData.append("cover", cover);
      }
      // validate data for book creation
      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        uploadMethod: "local",
        publishedAt: bookInfo.publishedAt,
        price: {
          mrp: Number(bookInfo.mrp),
          sale: Number(bookInfo.sale),
        },
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      };

      const result = newBookSchema.safeParse(bookToSend);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
      }
      if (result.data.uploadMethod === "local") {
        formData.append("book", file);
      }
      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];
        if (typeof value === "string") {
          formData.append(key, value);
        }
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        }
      }
      await onSubmit(formData);
      setBookInfo({ ...defaultBookInfo, file: null });
      setCover("");
      toast("Congratulations! Book published successfully", { duration: 5000 });
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleBookUpdate = async () => {
    setBusy(true);
    try {
      const formData = new FormData();
      const { file, cover } = bookInfo;
      // validate book file and cover file
      if (file && file?.type !== "application/epub+zip") {
        return setErrors({
          ...errors,
          file: ["Please select a valid (.epub) file."],
        });
      } else {
        setErrors({ ...errors, file: undefined });
      }

      if (cover && !cover?.type.startsWith("image/")) {
        return setErrors({
          ...errors,
          cover: ["Please select a valid poster file"],
        });
      } else {
        setErrors({ ...errors, cover: undefined });
      }

      if (cover) {
        formData.append("cover", cover);
      }
      // validate data for book creation
      const bookToSend: BookToSubmit = {
        title: bookInfo.title,
        description: bookInfo.description,
        genre: bookInfo.genre,
        language: bookInfo.language,
        publicationName: bookInfo.publicationName,
        uploadMethod: "local",
        publishedAt: bookInfo.publishedAt,
        slug: initialState?.slug,
        price: {
          mrp: Number(bookInfo.mrp),
          sale: Number(bookInfo.sale),
        },
      };
      if (file) {
        bookToSend.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }
      const result = updateBookSchema.safeParse(bookToSend);
      if (!result.success) {
        return setErrors(result.error.flatten().fieldErrors);
      }
      if (file && result.data.uploadMethod === "local") {
        formData.append("book", file);
      }
      for (const key in bookToSend) {
        type keyType = keyof typeof bookToSend;
        const value = bookToSend[key as keyType];
        if (typeof value === "string") {
          formData.append(key, value);
        }
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        }
      }
      await onSubmit(formData);
      // toast("Congratulations! Book published successfully", {duration: 5000});
    } catch (error) {
      parseError(error);
    } finally {
      setBusy(false);
    }
  };

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    if (isForUpdate) handleBookUpdate();
    else handleBookPublish();
  };

  useEffect(() => {
    if (initialState) {
      const {
        title,
        description,
        language,
        genre,
        publicationName,
        price,
        publishedAt,
        cover,
      } = initialState;
      if (cover) setCover(cover);
      setBookInfo({
        description,
        genre,
        language,
        publicationName,
        title,
        mrp: price.mrp,
        sale: price.sale,
        publishedAt,
      });
      setIsForUpdate(true);
    }
  }, [initialState]);

  return (
    <form onSubmit={handleOnSubmit} className="p-10 space-y-6">
      <h1 className="pb-6 font-semibold text-2xl w-full">{title}</h1>
      <div>
        <label className={clsx(errors?.file && "text-red-400")} htmlFor="file">
          <span>Select File: </span>
          <input
            accept="application/epub+zip"
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
          />
        </label>
        <ErrorList errors={errors?.file} />
      </div>

      <PosterSelector
        src={cover}
        name="cover"
        isInvalid={errors?.cover ? true : false}
        fileName={bookInfo.cover?.name}
        errorMessage={<ErrorList errors={errors?.cover} />}
        onChange={handleFileChange}
      />

      <Input
        type="text"
        name="title"
        isRequired
        label="Book Title"
        placeholder="Think and Grow Rich"
        value={bookInfo.title}
        onChange={handleTextChange}
        isInvalid={errors?.title ? true : false}
        errorMessage={<ErrorList errors={errors?.title} />}
      />

      <RichEditor
        placeholder="About Book..."
        isInvalid={errors?.description ? true : false}
        errorMessage={<ErrorList errors={errors?.description} />}
        editable
        value={bookInfo.description}
        onChange={(description) => setBookInfo({ ...bookInfo, description })}
      />

      <Input
        name="publicationName"
        type="text"
        label="Publication Name"
        isRequired
        placeholder="Penguin Book"
        value={bookInfo.publicationName}
        onChange={handleTextChange}
        isInvalid={errors?.title ? true : false}
        errorMessage={<ErrorList errors={errors?.publicationName} />}
      />

      <DatePicker
        onChange={(date) => {
          setBookInfo({ ...bookInfo, publishedAt: date.toString() });
        }}
        value={bookInfo.publishedAt ? parseDate(bookInfo.publishedAt) : null}
        label="Publish Date"
        showMonthAndYearPickers
        isRequired
        isInvalid={errors?.publishedAt ? true : false}
        errorMessage={<ErrorList errors={errors?.publishedAt} />}
      />

      <Autocomplete
        label="Language"
        placeholder="Select a Language"
        defaultSelectedKey={bookInfo.language}
        selectedKey={bookInfo.language}
        onSelectionChange={(key = "") => {
          setBookInfo({ ...bookInfo, language: key as string });
        }}
        isInvalid={errors?.language ? true : false}
        errorMessage={<ErrorList errors={errors?.language} />}
        isRequired
      >
        {languages.map((item) => {
          return (
            <AutocompleteItem value={item.name} key={item.name}>
              {item.name}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>

      <Autocomplete
        label="Genre"
        placeholder="Select a Genre"
        defaultSelectedKey={bookInfo.genre}
        selectedKey={bookInfo.genre}
        onSelectionChange={(key = "") => {
          setBookInfo({ ...bookInfo, genre: key as string });
        }}
        isInvalid={errors?.genre ? true : false}
        errorMessage={<ErrorList errors={errors?.genre} />}
        isRequired
      >
        {genres.map((item) => {
          return (
            <AutocompleteItem value={item.name} key={item.name}>
              {item.name}
            </AutocompleteItem>
          );
        })}
      </Autocomplete>

      <div>
        <div className="bg-default-100 rounded-md py-2 px-3">
          <p className={clsx("text-xs pl-3", errors?.price && "text-red-400")}>
            Price*
          </p>

          <div className="flex space-x-5 mt-2">
            <Input
              name="mrp"
              type="number"
              label="MRP"
              isRequired
              placeholder="0.00"
              value={bookInfo.mrp}
              onChange={handleTextChange}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              isInvalid={errors?.price ? true : false}
            />
            <Input
              name="sale"
              type="number"
              label="Sale Price"
              isRequired
              placeholder="0.00"
              value={bookInfo.sale}
              onChange={handleTextChange}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              isInvalid={errors?.sale ? true : false}
            />
          </div>
        </div>
        <div className="p-2">
          <ErrorList errors={errors?.price} />
        </div>
      </div>

      <Button isLoading={busy} type="submit" className="w-full">
        {submitBtnTitle}
      </Button>
    </form>
  );
};

export default BookForm;
