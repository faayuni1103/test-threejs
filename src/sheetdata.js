/*import { google } from 'googleapis';

// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
    keyFile: './client_secret.json',  // Path to your service account key file.
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Scope for Google Sheets API.
});

// Asynchronous function to read data from a Google Sheet.
async function readSheet() {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1xM5YA5lwo10NSp9SfxQEWaROSj2PPPVFb2n5yjELDtc';
    
    try {
        const range = 'Sheet1!A2:Z';  // Specifies the range to read. (Excludes headers in A1)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId, range
        });
        const rows = response.data.values;  // Extracts the rows from the response.
        
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return [];
        }

        console.log(`${rows.length} rows fetched`);
        return rows; // Returns all rows including headers.
    } catch (error) {
        console.error('error', error);  // Logs errors.
    }
}

// Function to classify the rows into categories and convert into a 2D array
function classifyData(rows) {
    // Return the data as a 2D array with each row representing a row in the Google Sheet
    return rows.map(row => row);
}

// Initialize an array to store the classified data
let classifiedData = [];

// Immediately-invoked function expression (IIFE) to execute the read and classify operations
(async () => {
    const rows = await readSheet();  // Read data from the sheet
    if (rows.length > 0) {
        classifiedData = classifyData(rows);  // Classify the data into a 2D array
        console.log(classifiedData);  // Logs the 2D array
    }
})();

// Export the classifiedData 2D array
export { classifiedData };*/
