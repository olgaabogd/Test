import { Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export class DownloadUtil {
  private page: Page
  savePath: any 
  constructor(page) {
    this.page = page
  }

  async downloadSetupFile(page) {
    
     await page.locator('.header_installsteam_btn_content').click()

    const downloadPromise = page.waitForEvent('download')

    await page
      .locator('#about_greeting')
      .getByRole('link', { name: 'Install Steam' })
      .click()

    const download = await downloadPromise
    const path = require('path');

      // Full path to the folder userFiles
      const userFilesPath = path.resolve(__dirname, '../userFiles');
      
      // Generate file name according to date
      // const currentDate = new Date();
      // const formattedDate = currentDate.toLocaleDateString().replace(/\//g, "-");
      // const fileName = `at_${formattedDate}.exe`;
      const fileName = `downloadedFile.exe`
            
      // Full path to the file
      this.savePath = path.join(userFilesPath, fileName);

    await download.saveAs(this.savePath)
  }

    async checkDownloadedFile() {

    fs.access(this.savePath, fs.constants.F_OK, (error) => {
    if (error) {
      console.log('File does not exist!');
    } else {
      console.log('File exists!');
    }
  })
}

//     async renameDownloadedFile(downloadPath)  {
//     const files = fs.readdirSync(downloadPath)
//     const latestFile = files.reduce((prev, curr) => {
//       const prevTimestamp = fs.statSync(`${downloadPath}/${prev}`).ctimeMs
//       const currTimestamp = fs.statSync(`${downloadPath}/${curr}`).ctimeMs
//       return currTimestamp > prevTimestamp ? curr : prev
//     })
//     const currentTimestamp = Date.now()
//     const renamedFile = `${downloadPath}/setup_${currentTimestamp}.exe`
//     fs.renameSync(`${downloadPath}/${latestFile}`, renamedFile)
//     return renamedFile
// } 
    
  }

