"use client";

import { useState } from "react";
import { punk, specialElite, cutMeOut2 } from "../../../fonts";
import { Dot } from "lucide-react";
export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setMessage("🎉 Thanks for subscribing!");
        setEmail("");
      } else {
        setMessage(data.error || "❌ Something went wrong.");
      }
    } catch (error) {
      setMessage("❌ Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={subscribe}
      className="relative min-h-screen bg-primary-500 flex flex-col justify-center gap-2xl overflow-hidden"
    >
      <div className="container w-min mx-auto flex flex-col justify-center z-10">
        <h2
          className={`text-neutral-900 leading-none text-8xl-fluid ${punk.className}`}
        >
          Some
        </h2>
        <h2
          className={`text-neutral-900 leading-none text-8xl-fluid ${punk.className}`}
        >
          People's
        </h2>
        <h2
          className={`text-neutral-900 leading-none text-8xl-fluid ${punk.className} self-end`}
        >
          Kids
        </h2>
      </div>

      <div className="flex container w-[512px] mx-auto justify-center -rotate-2 bg-neutral-900 z-10">
        <p
          className={`text-white text-xl ${cutMeOut2.className} text-center px-2 py-1`}
        >
          Subscribe.
          <br />
          Because authority hates it.
        </p>
      </div>

      <div className="flex container w-[512px] mx-auto z-10 flex-col gap-2 mt-2xl">
        <div className="flex">
          <input
            type="email"
            className={`outline-none font-specialElite leading-2xl bg-transparent border-b-neutral-900 border-b-md rounded-none text-white w-full placeholder:text-neutral-200 text-2xl`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`transition-colors duration-300 ease-in-out font-specialElite bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-1000 whitespace-nowrap text-2xl leading-2xl rounded-none text-white w-max px-md py-xs disabled:opacity-50`}
          >
            {loading ? (
              <span className="animate-pulse">
                <span className="animate-pulse">
                  <Dot />
                </span>
                <span className="animate-pulse">
                  <Dot />
                </span>
                <span className="animate-pulse">
                  <Dot />
                </span>
              </span>
            ) : (
              "Sign up!"
            )}
          </button>
        </div>
        <p className={` text-xl font-specialElite text-white min-h-[1.5rem]`}>
          {message}
        </p>
      </div>

      <div className="noise absolute inset-0 pointer-events-none" />
    </form>
  );
}
