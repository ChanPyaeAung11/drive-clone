"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { QUERIES, MUTATIONS } from "./db/queries";
import { AuthFn } from "node_modules/@clerk/nextjs/dist/types/app-router/server/auth";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();

  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const [file] = await QUERIES.getFileById(fileId, session.userId);
  if (!file) return { error: "File not found" };

  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://utfs.io/f/", ""),
  ]);
  console.log(utapiResult);

  const dbDeleteResult = await QUERIES.deleteFile(fileId, session.userId);
  console.log(dbDeleteResult);
  // this is to make sure UI is updated after file is deleted
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function deleteFolder(folderId: number) {
  const session = await auth();

  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const filesToDelete = await QUERIES.getFiles(folderId, session.userId);

  const fileURLsToDelete = filesToDelete.map((file) =>
    file.url.replace("https://utfs.io/f/", ""),
  );
  console.log(fileURLsToDelete);

  try {
    const utapiResult = await utApi.deleteFiles(fileURLsToDelete);
    console.log(utapiResult);
  } catch (e) {
    console.error();
  }

  const dbDeleteResult = await QUERIES.deleteFolder(folderId, session.userId);
  console.log(dbDeleteResult);
  // this is to make sure UI is updated after file is deleted
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));
  return { success: true };
}

export async function createFolder(
  parentFolderId: number,
  userId: string,
  folderName: string,
) {
  const session = await auth();

  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const dbCreateResult = await MUTATIONS.createFolder({
    folder: {
      name: folderName,
      parent: parentFolderId,
    },
    userId: userId,
  });
  console.log(dbCreateResult);
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));
  return { success: true };
}
