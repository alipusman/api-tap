import _ from "lodash"
import { functions } from "../../db"
const nodemailer = require('nodemailer');
export const ongeneratepricing = functions.firestore.onDocumentCreated('cek_harga/{idabsen}'
    , (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                // const idabsen = context.params.idabsen
                const snap = context.data
                const data = snap?.data()



                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'alipusman@aresa-digital.com',
                        pass: 'faasxyjkarvenciw' // BUKAN password biasa, tapi App Password!
                    }
                });

                // Email yang mau dikirim
                const mailOptions = {
                    from: '"PerkasaRacking" <alipusman@aresa-digital.com>',
                    to: 'iklantexas@gmail.com',
                    subject: `Submit Penawaran Harga ${data!.NamaPerusahaan}`,
                    text: _.toString(data), // fallback jika client email tidak support HTML
                    html: `
                      <html>
                        <body>
                          <h2>Detail Penawaran</h2>
                          <ul>
                            <li><strong>Nama:</strong> ${data!.Nama}</li>
                            <li><strong>Nama Perusahaan:</strong> ${data!.NamaPerusahaan}</li>
                            <li><strong>Nomor Customer:</strong> ${data!.NomorCustomer}</li>
                            <li><strong>Ukuran Gudang:</strong> ${data!.ukuranGudang}</li>
                            <li><strong>Ukuran Pallet:</strong> ${data!.ukuranPallet}</li>
                            <li><strong>Jumlah Pallet:</strong> ${data!.totalPallet}</li>
                            <li><strong>Level Rak:</strong> ${data!.levelPallet}</li>
                            <li><strong>Total Biaya:</strong> ${data!.estimasiHarga}</li>
                            <li><strong>Biaya PPN:</strong> ${data!.ppn}</li>
                            <li><strong>Harga Final:</strong> ${data!.hargaTotal}</li>
                          </ul>
                        </body>
                      </html>
                    `,
                  };

                // Kirim email
                return transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
                    if (error) {
                        console.error('Gagal kirim email:', error);
                        return reject()
                    }
                    console.log('✅ Email terkirim:', info.response);
                    return resolve()
                });


            } catch (error) {
                console.log('Error deleting document: ', error)

                return reject(error)

            }

        })

    })