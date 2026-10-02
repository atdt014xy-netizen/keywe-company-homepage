import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { ApiError } from "./security";
function app() {
  return (
    getApps()[0] ??
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  );
}
export async function identity(request: Request) {
  const match = /^Bearer (.+)$/.exec(
    request.headers.get("authorization") ?? "",
  );
  if (!match) throw new ApiError(401, "Sign in required");
  try {
    const token = await getAuth(app()).verifyIdToken(match[1], true);
    if (!token.email_verified) throw new Error("Unverified");
    return token.uid;
  } catch {
    throw new ApiError(401, "Sign in again and verify your email");
  }
}
export const messaging = () => getMessaging(app());
