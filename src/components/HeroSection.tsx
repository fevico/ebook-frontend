import { Button } from "@nextui-org/react";
import { FC } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";

interface Props {}

const books = [
  {
    title: "The Girl with the Dragon Tattoo",
    slogan: "J.D. Salinger",
    subtitle: "A Journey of Teenage Angst and Alienation",
    cover:
      "https://res.cloudinary.com/dhvh9ygvn/image/upload/v1728570087/o55erhxoousdiedkhpxx.png",
    slug: "the-girl-with-the-dragon-tattoo-6707e2ca04679ea8884d7751",
  },
  {
    title: "The Road",
    slogan: "Harper Lee",
    subtitle: "A Tale of Racial Injustice and Childhood Innocence",
    cover:
      "https://res.cloudinary.com/dhvh9ygvn/image/upload/v1728570078/lmfxdhx3ug8gtod2kpd7.png",
    slug: "the-road-6707e2ca04679ea8884d7750",
  },
  {
    title: "Murder on the Orient Express",
    slogan: "George Orwell",
    subtitle: "A Dystopian Vision of Totalitarianism",
    cover:
      "https://res.cloudinary.com/dhvh9ygvn/image/upload/v1728570089/c6nngayluknfnawbqhna.png",
    slug: "murder-on-the-orient-express-6707e2ca04679ea8884d7746",
  },
  {
    title: "The Hunger Games",
    slogan: "Jane Austen",
    subtitle: "A Romance Rooted in Social Commentary",
    cover:
      "https://res.cloudinary.com/dhvh9ygvn/image/upload/v1728570109/onfdooyygway1cizlpw9.png",
    slug: "the-hunger-games-6707e2ca04679ea8884d7752",
  },
  {
    title: "Pride and Prejudice",
    slogan: "F. Scott Fitzgerald",
    subtitle: "A Story of Wealth, Love, and the American Dream",
    cover:
      "https://res.cloudinary.com/dhvh9ygvn/image/upload/v1728570172/cyyyfnbkxsrnkahkxq9i.png",
    slug: "pride-and-prejudice-6707e2ca04679ea8884d774b",
  },
];
const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
}
const HeroSection: FC<Props> = () => {
  return (
    <div className="md:h-96 rounded-medium p-5 bg-[#faf7f2] dark:bg-[#231e1a]">
      <Slider {...settings}>
        {books.map((item) => {
          return (
           <div key={item.slug}>
             <div className="md:flex justify-between">
              <div className="flex-1 flex flex-col justify-center p-5">
                <h1 className="lg:text-6xl text-3xl">{item.slogan}</h1>
                <p className="md:text-lg mt-3 italic">{item.subtitle}</p>
              <div className="mt-3">
                <Button
                  radius="sm"
                  color="danger"
                  variant="bordered"
                  endContent={<FaArrowRightLong />}
                  as={Link}
                  to={`/book/${item.slug}`}
                >
                  Learn More
                </Button>
              </div>
              </div>
              <div className="p-5 flex-1 flex items-center justify-center">
                <img src={item.cover} alt={item.title} className="md:w-48 md:h-80 w-32 rounded-md object-cover shadow-lg rotate-12" />
              </div>
            </div>
           </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeroSection;
