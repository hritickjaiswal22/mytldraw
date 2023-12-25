import { generateUUID } from "@/utils/generateUUID";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [formState, setFormState] = useState({
    roomId: "",
    username: "",
  });
  const navigate = useNavigate();

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormState({
      roomId: (e as any).target[0].value,
      username: (e as any).target[1].value,
    });

    navigate(`/${formState.roomId}`, {
      state: {
        username: formState.username,
      },
    });
  }

  function createNewRoom() {
    setFormState((prev) => {
      return {
        ...prev,
        roomId: generateUUID(),
      };
    });
  }

  return (
    <article className="min-h-screen bg-[#fffbf0] flex justify-center items-center">
      <main className="px-6 py-8 bg-[#fff0c9] rounded-3xl max-w-[480px] w-11/12 flex flex-col gap-2 justify-center items-center">
        <h2 className="text-xl font-bold">Join via code!</h2>

        <form onSubmit={submitHandler} className="flex flex-col w-full gap-2">
          <input
            placeholder="Room id*"
            required
            onChange={(e) =>
              setFormState((prevState) => {
                return {
                  ...prevState,
                  roomId: e.target.value,
                };
              })
            }
            value={formState.roomId}
            name="roomId"
            type="text"
            className="w-full p-2"
          />
          <input
            placeholder="Username*"
            required
            onChange={(e) =>
              setFormState((prevState) => {
                return {
                  ...prevState,
                  username: e.target.value,
                };
              })
            }
            value={formState.username}
            name="username"
            type="text"
            className="w-full p-2"
          />

          <button
            type="submit"
            className="px-2 py-1 bg-white active:scale-[.98] flex justify-center items-center border-2 border-black  rounded-lg cursor-pointer"
          >
            Join
          </button>
        </form>

        <div className="relative flex h-7 items-center justify-center gap-2">
          <div className="w-6 border-t border-yellow-darker border-black"></div>
          <span className="flex-shrink font-primary text-sm text-yellow-darker dark:text-[#B9B9C6]">
            or
          </span>
          <div className="w-6 border-t border-yellow-darker border-black"></div>
        </div>

        <button
          type="button"
          onClick={createNewRoom}
          className="px-2 py-3 bg-white active:scale-[.98] flex justify-center items-center border-2 border-black  rounded-lg cursor-pointer"
        >
          New room
        </button>
      </main>
    </article>
  );
}

export default Home;
