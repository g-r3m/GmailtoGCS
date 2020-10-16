# GmailtoGCS
Simple Gmail Apps Script to upload multiple .csv to Google Cloud Storage based on labels applied with standard filters set on the mailbox

# General Information

Use Google Cloud Storage API 

# Dependencies 

This script is using Google Apps Script OAuth2 library to use Google Apps Script API. 
In order to get started with this read: 
 - https://github.com/gsuitedevs/apps-script-oauth2
You will need to change the Params in "Params.gs". 

 # Getting your script authenticate to Google Cloud Storage API

 In order to connect to Google Cloud Storage, on first connection, you will need to grant access to the script to the APIs.
 So, the script will open an HTML page to confirm if it failed or succeed. 

# Workflow of the GAS Script

The script will parse Thread params.LABELNAME, loop over messages of the Thread which are not Starred. 
All the messages with attachment(s) will  be uploaded to params.BUCKET_NAME

# Limitation / Known Issues

The upload is not performed to upload file bigger than 5Mb
To implement this feature you need to implement large file upload method

