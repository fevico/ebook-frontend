import { Button, Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import Book from "../svg/Book";
import client from "../api/Client";
import { RiMailCheckLine } from "react-icons/ri";

interface Props {}

const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
);

const SignUp: FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [invalidForm, setInvalidForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showSuccessResponse, setShowSuccessResponse] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    if (!emailRegex.test(email)) return setInvalidForm(true);
    setInvalidForm(false);

    setBusy(true);

    try {
      await client.post("/auth/generate-link", {
        email,
      });
      setShowSuccessResponse(true);
    } catch (error) {
      console.log(error);
    } finally{
      setBusy(false);
    }
  };

  if (showSuccessResponse)
    return (
      <div className="flex-1 flex flex-col items-center justify-center md:p-0 p-4">
        <RiMailCheckLine size={80} className="animate-bounce flex flex-col items-center justify-center" />
        <p className="text-lg font-semibold text-center">Please check your email we just send you a magic link</p>
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-96 border-2 p-5 rounded-medium">
        <Book className="w-44 h-44" />
        <h1 className="text-center text-xl font-semibold">
          books are the key to countless doors. Sign up and unlock the world of
          knowledge.
        </h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6 mt-6">
          <Input
            label="Email"
            placeholder="john@gmail.com"
            variant="bordered"
            value={email}
            isInvalid={invalidForm}
            errorMessage="Invalid email!"
            onChange={({ target }) => {
              setEmail(target.value);
            }}
          />
          <Button isLoading={busy} type="submit" className="w-full">
            Send Me The Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
