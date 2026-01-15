import express from 'express';
import invoiceModel from '../models/invoice';

export class InvoiceController{

  isInRange(internID: string, range: string): boolean {
    const [prefix, numStr] = internID.split("/");
    const broj = parseInt(numStr);

    const [rangePrefix, rangeNums] = range.split("/");
    if (prefix !== rangePrefix) return false;

    const [startStr, endStr] = rangeNums.split("-");
    const start = parseInt(startStr);
    const end = parseInt(endStr);

    return broj >= start && broj <= end;
  }

    getAllInvoices = (req: express.Request, res: express.Response)=>{
        invoiceModel.find().then(invoices=>{
            res.json(invoices)
        }).catch(err=>{
           res.json(null)
        })
    }

    getInvoiceByID = async (req: express.Request, res: express.Response)=>{
        try {
        let internID = req.params.id + "/" + req.params.number;
        const invoices = await invoiceModel.find();

        const found = invoices.find(inv => this.isInRange(internID, inv.internIDs!));

        if (found) {
          return res.json(found);
        } else {
          return res.json(null);
        }
      } catch (err) {
        res.json(null);
      }
    }

    saveInvoice = async (req: express.Request, res: express.Response) => {
    try {
          const invoices = req.body;
    
          if (!Array.isArray(invoices) || invoices.length === 0) {
            return res.json({ message: 'Nije prosleđena lista podataka.' });
          }
    
          await invoiceModel.insertMany(invoices);
    
          return res.json({message: 'ok'});
        } catch (error) {
          return res.json({ message: 'Greška pri dodavanju podataka.' });
        }
  };

}