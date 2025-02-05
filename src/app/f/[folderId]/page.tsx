import { auth } from "@clerk/nextjs/server";
import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { redirect } from "next/navigation";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>; // since folderId is diff depend on users, make it a promise
}) {
  const params = await props.params; // await will let compiler and all layers know below this is dynamic code
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) return <div> Invalid Folder Id</div>;

  console.log(params.folderId);

  const session = await auth();
  if (!session.userId) return redirect("/sign-in");

  let folders, files, parents, rootFolder;
  try {
    [folders, files, parents, rootFolder] = await Promise.all([
      QUERIES.getFolders(parsedFolderId, session.userId),
      QUERIES.getFiles(parsedFolderId, session.userId),
      QUERIES.getAllParentsForFolder(parsedFolderId, session.userId),
      QUERIES.getRootFolderForUser(session.userId),
    ]);
  } catch (e) {
    const error =
      e instanceof Error
        ? e
        : new Error("Unknown error while fetching folder contents");
    console.error("Folder contents fetch error:", e);
    return <div>{error.message}</div>;
  }
  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={parsedFolderId}
      rootFolder={rootFolder}
      userId={session.userId}
    />
  );
}
