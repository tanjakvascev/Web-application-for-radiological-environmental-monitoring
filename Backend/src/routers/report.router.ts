import express from 'express'
import { ReportController } from '../controllers/report.controller'

const reportRouter = express.Router()

reportRouter.route('/getAllReports').get(
    (req, res) => new ReportController().getAllSamples(req, res)
)

reportRouter.route('/generateReport').post(
    (req, res) => new ReportController().generateReport(req, res)
)

reportRouter.route('/getWordReport/:id/:number').get(
    async (req, res) => { await new ReportController().getWordReport(req, res)}
)

reportRouter.route('/setStatus').post(
    async (req, res) => { await new ReportController().setStatus(req, res)}
)

export default reportRouter;