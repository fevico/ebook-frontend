import { FC } from "react";
import useAuth from "../hooks/UseAuth";
import { Avatar, Button } from "@nextui-org/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

interface Props {}

const Profile: FC<Props> = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/sign-up" />;
  const { role, avatar } = profile;
  const isAuthor = role === "author";

  return (
    <div className="flex-1 flex flex-col items-center md:px-0 px-3 py-5">
      <div className="flex items-center md:flex-row flex-col md:min-w-96 min-w-full space-y-4">
        <Avatar
          src={avatar}
          className="md:w-20 md:h-20 w-14 h-14"
          radius="sm"
          name={profile?.name}
        />
        <div className="flex-1 pl-4">
          <p className="md:text-xl text-base font-semibold">{profile.name}</p>
          <p className="md:text-base text-sm truncate ">{profile.email}</p>
          <div className="flex justify-between items-center">
            <p>
              Role:{" "}
              <span className="italic text-sm">
                {profile.role.toLocaleUpperCase()}
              </span>
            </p>

            <div className="pl-3">
            {!isAuthor ? (
              <Link className="text-xm underline" to="/author-registration">
                Become an Author
              </Link>
            ) : <Link className="text-xm underline" to="/update-author">
            Update Author Bio
          </Link>}
            </div>
          </div>
        </div>
        <Button
          onClick={() => navigate("/update-profile")}
          className="ml-auto md:w-auto w-full"
          variant="flat"
          isIconOnly
        >
          <BsPencilSquare size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
