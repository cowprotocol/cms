import * as csv from 'fast-csv';

export async function parseNotificationsFile(path: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const data: string[][] = []

    csv.parseFile(path, {delimiter: ';'})
      .on('data', row => {
        data.push(row)
      })
      .on('error', error => {
        console.error(error)
        reject(error)
      })
      .on('end', () => {
        resolve(data)
      });
  })
}
