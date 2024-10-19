import { FC } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { updateProfile } from "../store/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Props {}

const Verify: FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const profileInfo = searchParams.get("profile");
  console.log(profileInfo);
  const dispatch = useDispatch();

  if (profileInfo) {
    try {
      const profile = JSON.parse(profileInfo);
      if (!profile.signedUp) return <Navigate to="/new-user" />;

      dispatch(updateProfile(profile));
      return <Navigate to="/" />;
    } catch (error) {
      return <Navigate to="/not-found" />;
    }
  }

  return (
    <LoadingSpinner/>
  );
};

export default Verify;
