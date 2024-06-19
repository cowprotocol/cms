export interface NotificationRaw {
  templateId: number
  data: any
  account: string
}

export function parseNotification(rows: string[][]): NotificationRaw[] {
  return rows.slice(1).reduce<NotificationRaw[]>((acc, row, index) => {
    if (typeof row[0] !== 'string') throw new Error('CSV file is invalid!')

    const templateId = +row[0].trim()
    const account = row[1].trim()
    const data = parseData(row[2].trim())

    if (templateId && account && data) {
      const notification: Partial<NotificationRaw> = {templateId, account, data}

      acc.push(notification as NotificationRaw)
    } else {
      throw new Error(`Notification is invalid, templateId: ${templateId}, account: ${account}, data: ${data}`)
    }

    return acc
  }, [])
}

function parseData(input: string): any {
  try {
    return JSON.parse(input)
  } catch (e) {
    console.error(e)
    return null
  }

}
