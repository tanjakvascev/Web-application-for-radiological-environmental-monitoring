import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.router'
import sampleRouter from './routers/sample.router'
import isotopeRouter from './routers/isotope.router'
import invoiceRouter from './routers/invoice.router'
import reportRouter from './routers/report.router'

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/Laboratorija060')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})

app.use("/", userRouter)
app.use("/samples", sampleRouter)
app.use("/isotope", isotopeRouter)
app.use("/invoice", invoiceRouter)
app.use("/report", reportRouter)

app.listen(4000, ()=>console.log('Express running on port 4000'))
