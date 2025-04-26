import { CloudTasksClient, functions, url_taskhandler } from "../../db"

export const oncreatestockcoil = functions.firestore.onDocumentCreated('stock_coil/{idcoil}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const data = snap?.data()
            const id_subcoil = data!.id_subcoil

            const que = "projects/tap-erp-94e6c/locations/us-central1/queues/coilque"


            const client_task2 = new CloudTasksClient()
            const payload = { id_subcoil, data }
            const task = {
                httpRequest: {
                    httpMethod: "POST",
                    url: url_taskhandler + 'coilmodule/tambahcoil987',
                    body: Buffer.from(JSON.stringify(payload)).toString("base64"),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            }
            const request = {
                parent: que,
                task,
            };
            const b = await client_task2.createTask(request);
            console.log(b)
            return resolve()

        } catch (error) {
            console.log('Error registration topic: ', error)

            return reject(error)

        }

    })

})