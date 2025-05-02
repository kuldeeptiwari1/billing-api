const fs = require('fs');
const path = require('path');
const axios = require('axios');
const XLSX = require('xlsx');
const cron = require('node-cron');
const ManagerToEmp = require('../db/models/ManagerToEmp');

// Function to get the access token using Box OAuth 2.0
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', '0kfpwbq524rq7i2e20e1ooh2mmi4lgjs');
  params.append('client_secret', 'cSIXgLgR5CaNbn5WoYhcugIYO8KmN6gj');

  try {
    const response = await axios.post('https://api.box.com/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response.data);
  }
}

// Function to download a file from Box using the access token
async function downloadFileFromBox(accessToken, fileId) {
  const url = `https://api.box.com/2.0/files/${fileId}/content`;

  try {
    const response = await axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'stream',
    });

    const filePath = path.join(__dirname, 'temp.xlsx');
    const writeStream = fs.createWriteStream(filePath);

    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log('File downloaded from Box successfully.');
        resolve(filePath);
      });

      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file from Box:', error);
  }
}

// Function to read the Excel file and update MongoDB
async function readExcelAndUpdateDB(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  worksheet.forEach(async (row) => {
    const fullName = `${row['Legal First Name']}.${row['Legal Last Name']}`;
    let managerName = row['Reports To Legal Name'];
    managerName = managerName.split(', ').reverse().join(' ');

    const mteData = {
      employee: fullName,
      manager: managerName,
      contract: row['Contract'] ? row['Contract'].toLowerCase()=='corp'? 'Corporate': row['Contract'] : 'Corporate',
    };

    await ManagerToEmp.findOneAndUpdate(
      { employee: fullName },
      mteData,
      { upsert: true, new: true }
    ).then((doc) => {
      console.log(`Processed: ${fullName}`);
    }).catch((err) => {
      console.error(`Error processing ${fullName}:`, err);
    });
  });

  console.log('Excel data processed and updated in MongoDB.');
}

// Main function to get token, download file, and update MongoDB
async function runTask() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('No access token obtained.');
      return;
    }

    const fileId = '1649645486116'; // Replace with your Box file ID
    const filePath = await downloadFileFromBox(accessToken, fileId);

    if (filePath) {
      await readExcelAndUpdateDB(filePath);
    }
  } catch (error) {
    console.error('Error in task execution:', error);
  }
}

// Schedule task once a week (Sunday at midnight)
cron.schedule('0 0 * * 0', () => {
  console.log('Running weekly task...');
  runTask();
});

// For testing, run the function immediately
runTask();
