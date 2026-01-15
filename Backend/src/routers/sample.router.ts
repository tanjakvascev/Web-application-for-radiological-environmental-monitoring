import express from 'express'
import { SampleController } from '../controllers/sample.controller'

const sampleRouter = express.Router()

sampleRouter.route('/getAllSamples').get(
    (req, res) => new SampleController().getAllSamples(req, res)
)

sampleRouter.route('/getSampleByInternID/:id/:number').get(
    (req, res) => new SampleController().getSampleByInternID(req, res)
)

sampleRouter.route('/deleteSample').post(
    async (req, res) => { await new SampleController().deleteSample(req, res)}
)

sampleRouter.route('/changeSampleName').post(
    async (req, res) => { await new SampleController().changeSampleName(req, res)}
)

sampleRouter.route('/addSamples').post(
    async (req, res) => { await new SampleController().addSamples(req, res)}
)

export default sampleRouter;