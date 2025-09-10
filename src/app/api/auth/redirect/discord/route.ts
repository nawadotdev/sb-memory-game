import { NextResponse } from "next/server";
import { getOAuthUrl } from "@/lib/discord";
import { signState } from "@/lib/jwt";

export async function GET() {
  const { state, url } = await getOAuthUrl({ scopes: ["identify", "email"] });
  const signed = signState(state);

  const res = NextResponse.redirect(url, { status: 302 });
  res.cookies.set("clientState", signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });
  res.cookies.set("userToken", "", { maxAge: 0, path: "/" }) 

  return res;
}
