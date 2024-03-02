
import * as bootstrap from 'bootstrap'
import jsPDF from 'jspdf';
import { supabase } from '../scripts/supabase'


const main = () => {

  // Si el usuario no esta autenticado se enviara al login.
  // Este evento se dispara cuando el contenido cargue
  document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.log('usuario no autenticado!')
      window.location.href = `${window.location.origin}/login.html`
    }
  })

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

  const cerrarSesion = async () => {
    // al dar click al boton "cerrar sesion" se elimina la sesion de supabase y los datos guardados del usuario, para ser enviado al login
    document.querySelector('#btn-logout').addEventListener('click', async () => {
      await supabase.auth.signOut()
      sessionStorage.removeItem('user')
      window.location.href = `${window.location.origin}/login.html`
    })
  }
  cerrarSesion()

}


main()
