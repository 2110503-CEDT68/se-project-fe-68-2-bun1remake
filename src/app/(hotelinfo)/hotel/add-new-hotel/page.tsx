"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
// ...existing code...
export default function Home() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const uploadedUrl = res?.[0]?.serverData?.fileUrl ?? null;
          setImgUrl(uploadedUrl);

          console.log("Files:", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />

      <div>
        <div>{imgUrl}</div>

        {imgUrl ? (
          <Image
            src={imgUrl}
            width={600}
            height={600}
            alt="Your uploaded image"
          />
        ) : null}
      </div>
    </main>
  );
}
