
import * as bootstrap from 'bootstrap'
import jsPDF from 'jspdf';
import { supabase } from '../scripts/supabase'


const main = () => {



  const imprimirPDF = () => {
    document.querySelector('#imprimir-pdf').addEventListener('click', async () => {

      document.querySelectorAll('.hide-pdf').forEach(btn => {
        btn.style.display = 'none'
      })

      const opt = {
        margin: 1,
        filename: `${crypto.randomUUID()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'in', format: 'legal', orientation: 'landscape' }
      };

      await html2pdf().set(opt).from(document.querySelector('main')).save();

      document.querySelectorAll('.hide-pdf').forEach(btn => {
        btn.style.display = 'inline'
      })


    })
  }

  imprimirPDF()

}



main()