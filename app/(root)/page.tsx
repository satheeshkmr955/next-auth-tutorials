"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  return (
    <div>
      <div>{status}</div>
      <div className="flex justify-between items-center w-40">
        <button onClick={() => signIn()}>signIn</button>
        <button onClick={() => signOut()}>signOut</button>
      </div>
    </div>
  );
}
