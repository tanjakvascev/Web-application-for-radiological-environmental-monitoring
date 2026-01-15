import express from 'express'
import { InvoiceController } from '../controllers/invoice.controller'

const invoiceRouter = express.Router()

invoiceRouter.route('/getAllInvoices').get(
    (req, res) => new InvoiceController().getAllInvoices(req, res)
)

invoiceRouter.route('/getInvoiceByID/:id/:number').get(
    async (req, res) =>{ await new InvoiceController().getInvoiceByID(req, res)}
)

invoiceRouter.route('/saveInvoice').post(
    async (req, res) => { await new InvoiceController().saveInvoice(req, res)}
)

export default invoiceRouter;