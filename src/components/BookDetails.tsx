import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { calculateDiscount, formatPrice, parseError } from "../utils/helper";
import { Button, Chip, Divider } from "@nextui-org/react";
import {
  FaEarthAfrica,
  FaMasksTheater,
  FaRegCalendarDays,
  FaRegFileLines,
  FaStar,
} from "react-icons/fa6";
import RichEditor from "./rich-editor";
import { TbShoppingCartPlus } from "react-icons/tb";
import useCart from "../hooks/useCart";
import client from "../api/Client";
import useAuth from "../hooks/UseAuth";

export interface Book {
  id: string;
  title: string;
  genre: string;
  slug: string;
  description: string;
  cover?: string;
  language: string;
  publicationName: string;
  publishedAt: string;
  fileInfo: {
    id: string;
    size: string;
  };
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Props {
  book?: Book;
}

const BookDetails: FC<Props> = ({ book }) => {
  const [busy, setBusy] = useState(false)
  const {profile} = useAuth()
  const { updateCart, pending } = useCart();
  if (!book) return null;
  const alreadyPurchased = profile?.books?.includes(book.id) || false;

  const handleBuyNow = async() =>{
    try {
      setBusy(true)
    const {data} = await client.post('/checkout/instant', {productId: id})
    if(data.checkoutUrl){
      window.location.href = data.checkoutUrl
    }
    } catch (error) {
      parseError(error)
    }finally{
      setBusy(false)
    }    
  }

  const handleCartUpdate = () => {
    updateCart({ product: book, quantity: 1 });
  };
  const {
    cover,
    id,
    title,
    slug,
    author,
    description,
    language,
    fileInfo,
    genre,
    publishedAt,
    rating,
    publicationName,
    price,
  } = book;
  return (
    <div className="md:flex">
      <div>
        <img
          src={cover}
          alt={title}
          className="w-48 h-80 rounded-md object-cover"
        />
      </div>
      <div className="pl-0 md:pl-10 flex-1 pt-6">
        <h1 className="sm:text-3xl text-2xl font-semibold">{title}</h1>
        <div>
          <Link
            className="font-semibold hover:underline"
            to={`/author/${author.id}`}
          >
            {author.name}
          </Link>
          <p>{publicationName}</p>
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <p className="font-semibold">{formatPrice(Number(price.sale))}</p>
          <p className="line-through italic">
            {formatPrice(Number(price.mrp))}
          </p>
          <Chip color="danger">{`${calculateDiscount(price)}% off`}</Chip>
        </div>

        <div className="mt-3 flex items-center space-x-2 font-semibold">
          {rating ? (
            <Chip color="danger">
              <div className="flex space-x-1 items-center">
                <span>{rating}</span>
                <FaStar />
              </div>
            </Chip>
          ) : (
            <Chip>
              <span className="text-xs">No Ratings</span>
            </Chip>
          )}
          <Link
            to={`/rate/${id}`}
            className="font-normal text-sm hover:underline"
          >
            Add Review
          </Link>
        </div>
        <div className="mt-6">
          <RichEditor value={description} className="regular" />
        </div>

        <div className="flex items-center space-x-6 mt-6 h-10">
          <div className="flex flex-col items-center justify-center space-y-1">
            <FaEarthAfrica className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">{language}</span>
          </div>
          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaMasksTheater className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">{genre}</span>
          </div>
          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegFileLines className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">
              {fileInfo.size}
            </span>
          </div>
          <Divider orientation="vertical" className="h-1/2" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <FaRegCalendarDays className="sm:text-2xl text-xl" />
            <span className="sm:text-xs text-[10px] truncate">
              {publishedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center mt-6 space-x-3">
          {alreadyPurchased ? (
            <Button radius="sm" as={Link} to={`/read/${slug}?title=${title}&id=${id}`}>
              Read Now
            </Button>
          ) : (
            <>
              <Button
                isLoading={pending || busy}
                onClick={handleCartUpdate}
                variant="light"
                startContent={<TbShoppingCartPlus />}
              >
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} isLoading={pending || busy} variant="flat">
                Buy Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
