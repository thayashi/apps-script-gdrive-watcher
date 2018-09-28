# Google Apps Script Google Drive Watcher
An example of how to query Google Drive V3 API from Goole Apps Script.

## Tech Stack
- [google/clasp](https://github.com/google/clasp)
- [TypeScript](http://www.typescriptlang.org/)
- [TSLint](https://palantir.github.io/tslint/)
- [Google Drive V3 API](https://developers.google.com/drive/api/v3/reference/)

## How it works
This script checks the specified folder recursively. If there are updated files in the past N hours,  it sends an e-mail. It will look like:

![image](https://github.com/thayashi/apps-script-gdrive-watcher/blob/images/screenshot.png?raw=true)

## Configuration
First of all, create .clasp.json (like .clasp.json.example), put your script ID on it.
The following variables in main.ts are required to be changed:

 - `folderID` -  The root folder ID which you want to search (ex: 0BzC_ZCA5viU_NUVTSlViM0xMV2s)
 - `teamDriveID` -If the folderID is under a team drive, needs to specify the team drive ID
 - `pastTime` - If the past time is set as (24 * 60 * 60 * 1000), it searches he files updated in the past 24 hours.
 - `timeZone` - Used for the time-format in the mail content
 - `sentTo` - The email address you want to sent to
 - `mailSubject` - The mail subject
 - `senderName` - The sender name

## License
This software is released under the MIT License, see LICENSE.txt.