import { v2 as cloudinary } from "cloudinary";

const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "dp0btetfq";
const NEXT_PUBLIC_CLOUDINARY_API_KEY = "238347687729642";
const CLOUDINARY_API_SECRET = "GrBh6nrN8Vc8lrEbwGrSvGw1hCg";
try {
  cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} catch {
  console.log("Cloudinary configuration error");
}

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
