/**
 * Builds a complete URL from a base URL and a map of URL parameters. Written by Eric Koleda in the OAuth2 library
 */
function buildUrl(url: string, params: object = {}): string {
  const paramString: string = Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + paramString;
}
export {buildUrl};

/**
 * Gets child folders list
 */
function getChildFolderList(list, rootFolder) {
  list.push({
    id: rootFolder.getId(),
    name: rootFolder.getName(),
  });
  const childFolders = rootFolder.getFolders();
  while (childFolders.hasNext()) {
    const child = childFolders.next();
    const childList = getChildFolderList(list, child);
    list = childList;
  }
  return list;
}
export {getChildFolderList};

/**
 * UrlFetch
 */
function UrlFetch(baseUrl: string, searchOptions) {
  const token: string = ScriptApp.getOAuthToken();
  const fetchUrl: string = buildUrl(baseUrl, searchOptions);
  const fetchOptions = {
    muteHttpExceptions: true,
    contentType: "application/json",
    headers: {Authorization: "Bearer " + token},
  };

  const httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(fetchUrl, fetchOptions);
  if (httpResponse.getResponseCode() !== 200) {
    throw new Error(httpResponse.getContentText());
  } else {
    const response = JSON.parse(httpResponse.getContentText());
    console.log(response);
    return response;
  }
}
export {UrlFetch};

/**
 * buildGDriveSearchQuery
 */
function buildGDriveSearchQuery(folderID: string, pastTime: number): string {
  const today: Date = new Date();
  const startTime: Date = new Date(today.getTime() - pastTime);
  const startTimeString: string = startTime.toISOString();
  const rootFolder: GoogleAppsScript.Drive.Folder
    = DriveApp.getFolderById(folderID);
  const folderList = getChildFolderList([], rootFolder);
  let searchQuery: string = "(modifiedTime > '" + startTimeString + "') and (";
  for (let i = 0; i < folderList.length; i++) {
    if (i === 0) {
      searchQuery += "('" + folderList[i].id + "' in parents)";
    } else {
      searchQuery += " or ('" + folderList[i].id + "' in parents)";
    }
  }
  searchQuery += ")";
  return searchQuery;
}
export {buildGDriveSearchQuery};
