/* Written by Jeremy Dessalines d'Orbigny */
/* Date: 30 Sep 2020 */




/*
 * This function will upload a file to Google Cloud Storage bucket
 *  params {blob} blob of the file to be uploaded
 *  params {FILE_NAME} name of the file to be uploaded
 */
function uploadFileToGCS_(blob, FILE_NAME) {
  var service = getService_();
  if (!service.hasAccess()) {
    Logger.log("Please authorize %s", service.getAuthorizationUrl());
    return;
  BUCKET_NAME = params.BUCKET_NAMEPROD;
  var bytes = blob.getBytes();

  var url = 'https://www.googleapis.com/upload/storage/v1/b/BUCKET/o?uploadType=media&name=FILE'
    .replace("BUCKET", BUCKET_NAME)
    .replace("FILE", encodeURIComponent(FILE_NAME));

  var response = UrlFetchApp.fetch(url, {
    method: "POST",
    contentLength: bytes.length,
    contentType: blob.getContentType(),
    payload: bytes,
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  });

  var result = JSON.parse(response.getContentText());
  Logger.log(JSON.stringify(result, null, 2));
}


/*
 * This function parse Gmail mailbox of the user
 * Collect thread under "labelName"
 * Parse all emails under the thread. 
 * If email contains an attachment and isUnstarred. The attachment is upload to Google Cloud Storage
 * It add a star to the mail
 * NB: Need to add a rule in the mailbox to add the Label the email to be analyzed
 */

function getAttachmentsfromLabel() {
  // Label to be checked
  var labelName = params.LABELNAME;
  var label = GmailApp.getUserLabelByName(labelName);
  var threads = label.getThreads();
  var result = [];
  // Loop over messages under the thread
  for (var i = 0; i < threads.length; i++) {
    Logger.log(threads[i].getMessages().length);
    var msgs = GmailApp.getMessagesForThreads(threads);
    // Loop over messages with attachments
    for (var i = 0; i < msgs.length; i++) {
      // Loop over all attachments of the message
      for (var j = 0; j < msgs[i].length; j++) {
        var attachments = msgs[i][j].getAttachments();
        Logger.log('New message "%s" contains "%s" attachments.',
        msgs[i][j].getSubject(), attachments.length);
        for (var k = 0; k < attachments.length; k++) {
          // If the message is not starred upload and add a star to the message
          // If idStarred do nothing
          if (msgs[i][j].isStarred()) {} else {
            Logger.log('New message "%s" contains the attachment "%s" (%s bytes)',
              msgs[i][j].getSubject(), attachments[k].getName(), attachments[k].getSize());
            var attachment = attachments[k].copyBlob();
            var attachmentName = attachments[k].getName();
            uploadFileToGCS_(attachment, attachmentName);
           // Add the email ID of the attachement in an array  
            result.push(msgs[i][j]);
          }
        }
      }
    }
  }
  Logger.log('A list of "%s" attachments have been uploaded', result.length);
  for (var l = 0; l < result.length; l++) {
    result[l].star();
  }
  Logger.log('The list of "%s" attachments emails have been starred', result.length);

}
