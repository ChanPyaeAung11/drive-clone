"use client";

import { ChevronRight } from "lucide-react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import { NewFolderButton } from "./new-folder";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
  rootFolder: typeof folders_table.$inferSelect | undefined;
  userId: string;
}) {
  const navigate = useRouter();

  return (
    <div className="h-auto w-auto p-8 text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href={`/f/${props.rootFolder?.id}`}
            className="mr-2 text-gray-300 hover:text-white"
          >
            My Drive
          </Link>
          {props.parents.map((folder) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="mx-2 text-gray-500" size={16} />
              <Link
                href={`/f/${folder.id}`}
                className="text-gray-300 hover:text-white"
              >
                {folder.name}
              </Link>
            </div>
          ))}
        </div>
        <NewFolderButton
          parentFolderId={props.currentFolderId}
          userId={props.userId}
        />

        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="rounded-lg shadow-xl">
        <div className="border-b border-gray-700 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-left text-sm font-medium text-gray-400">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        <ul>
          {props.folders.map((folder) => (
            <FolderRow key={folder.id} folder={folder} />
          ))}
          {props.files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
      </div>
      <UploadButton
        className="mt-4"
        content={{
          button({ ready }) {
            if (ready) return "Upload File(s)";
          },
        }}
        endpoint="driveUploader"
        onBeforeUploadBegin={(files) => {
          return files.map((file) => {
            const lastDotIdx = file.name.lastIndexOf(".");
            const fileExtension =
              lastDotIdx === -1 ? "blob" : file.name.slice(lastDotIdx + 1);
            return new File([file], file.name, {
              type: fileExtension,
              lastModified: file.lastModified,
            });
          });
        }}
        input={{
          folderId: props.currentFolderId,
        }}
      />
    </div>
  );
}
