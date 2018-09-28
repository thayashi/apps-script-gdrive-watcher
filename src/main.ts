import {buildGDriveSearchQuery, UrlFetch} from "./util";

const folderID: string = "YOUR_FOLDER_ID";
 // The root folder ID which you want to search ex: 0BzC_ZCA5viU_NUVTSlViM0xMV2s
const teamDriveID: string | null = null;
// If the folderID is under a team drive, needs to specify the team drive ID
const pastTime: number = 24 * 60 * 60 * 1000; // 1day
const timeZone: string = "America/Los_Angeles"; // Used for the time-format in the mail content
// http://joda-time.sourceforge.net/timezones.html
const sentTo: string = "xxx@gmail.com"; // The email address you want to sent to
const mailSubject: string = "Update Notice"; // The mail subject
const senderName: string = "Update Watcher"; // The sender name

/**
 * Creates a list of changed files and send it by e-mail
 */
function main() {
  // Gets changed file list in past-time
  const filesApiUrl: string = "https://www.googleapis.com/drive/v3/files";
  // https://developers.google.com/drive/v3/reference/files/list
  const filesApiSearchOptions: any = {
    corpora: (teamDriveID) ? "teamDrive" : "user",
    includeTeamDriveItems: (teamDriveID) ? true : false,
    orderBy: "modifiedTime desc",
    pageSize: 50,
    supportsTeamDrives: (teamDriveID) ? true : false,
    q: buildGDriveSearchQuery(folderID, pastTime),
  };
  if (teamDriveID) {
    filesApiSearchOptions.teamDriveId = teamDriveID;
  }
  const changedFileList: any[] = UrlFetch(filesApiUrl, filesApiSearchOptions).files;
  const detailChangedFileList: any[] = [];
  changedFileList.forEach((file) => {
    // Gets the meta data of each file
    const baseUrl: string = "https://www.googleapis.com/drive/v3/files/" + file.id;
    // https://developers.google.com/drive/v3/reference/files/get
    const searchOptions = {
      acknowledgeAbuse: false,
      supportsTeamDrives: true,
      fields: "id,name,modifiedTime,lastModifyingUser",
    };
    const result = UrlFetch(baseUrl, searchOptions);
    detailChangedFileList.push(result);
  });

  // Builds list html
  let row = "";
  let count = 0;
  detailChangedFileList.forEach((file) => {
    const fileName: string = file.name;
    const fileURL: string = "https://drive.google.com/open?id=" + file.id;
    const lastUpdated: string = Utilities.formatDate(
      new Date(file.modifiedTime),
      timeZone,
      "yyyy-MM-dd HH:mm",
    );
    // https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)
    const lastModifyingUser = file.lastModifyingUser.displayName;
    row +=
      "<li>" +
      lastUpdated +
      " <a href='" +
      fileURL +
      "'>" +
      fileName +
      "</a> by " +
      lastModifyingUser +
      "</li>";
    count++;
  });

  // Sends a mail
  if (row !== "") {
    const pastTimeByHour: number = Math.floor(pastTime / (60 * 60 * 1000));
    const today = Utilities.formatDate(
      new Date(),
      timeZone,
      "MM/dd/yyyy",
    );
    const content = `
    <p>
      ${count} file(s) have changed in the folder in the past ${pastTimeByHour} hours. Here's the list:
    </p>
    <ol>
      ${row}
    </ol>`;
    MailApp.sendEmail({
      to: sentTo,
      subject: mailSubject + " - " + today,
      name: senderName,
      htmlBody: content,
    });
  }
}
