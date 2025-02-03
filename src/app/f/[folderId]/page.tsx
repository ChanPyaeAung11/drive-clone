import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { db } from "~/server/db";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";
import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>; // since folderId is diff depend on users, make it a promise
}) {
  const params = await props.params; // await will let compiler and all layers know below this is dynamic code
  const parsedFolderId = parseInt(params.folderId);
  if (isNaN(parsedFolderId)) return <div> Invalid Folder Id</div>;

  console.log(params.folderId);

  // try catch wrap this
  const [folders, files, parents] = await Promise.all([
    getFolders(parsedFolderId),
    getFiles(parsedFolderId),
    getAllParentsForFolder(parsedFolderId),
  ]);
  return <DriveContents files={files} folders={folders} parents={parents} />;
}
