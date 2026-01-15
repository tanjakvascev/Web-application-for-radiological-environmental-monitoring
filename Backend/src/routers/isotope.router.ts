import express from 'express'
import { IsotopeController } from '../controllers/isotope.controller'

const isotopeRouter = express.Router()

isotopeRouter.route('/getAllIsotopes').get(
    (req, res) => new IsotopeController().getAllIsotopes(req, res)
)

isotopeRouter.route('/getPolCoeffs').get(
    (req, res) => new IsotopeController().getPolCoeffs(req, res)
)

isotopeRouter.route('/getFONtime').get(
    (req, res) => new IsotopeController().getFONtime(req, res)
)

isotopeRouter.route('/getFON').get(
    async (req, res) => { await new IsotopeController().getFON(req, res)}
)

isotopeRouter.route('/saveCalculation').post(
    async (req, res) => { await new IsotopeController().saveCalculation(req, res)}
)

isotopeRouter.route('/getAllCalculations').get(
    (req, res) => new IsotopeController().getAllCalculations(req, res)
)

isotopeRouter.route('/getCalculationByInternID/:id/:number').get(
    (req, res) => new IsotopeController().getCalculationByInternID(req, res)
)

export default isotopeRouter;