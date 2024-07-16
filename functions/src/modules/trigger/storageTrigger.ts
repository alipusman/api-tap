import { clientv, functions } from "../../db";

export const storagetrigger = functions.storage.object().onFinalize(async (object) => {
    return new Promise<void>(async (resolve, reject) => {
        try {

            const fileBucket = object.bucket; // The Storage bucket that contains the file.
            const filePath = object.name; // File path in the bucket.
            // const contentType = object.contentType;
            const [result] = await clientv.textDetection(`gs://${fileBucket}/${filePath}`);
            const detections = result.textAnnotations;
            console.log('Text:');
            detections.forEach((text: any) => console.log(text.description));
            return resolve();
        } catch (error) {
            console.log(error);
            return reject(error);
        }

    });

});

