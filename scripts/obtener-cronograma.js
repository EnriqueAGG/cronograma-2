
import * as bootstrap from 'bootstrap'
import jsPDF from 'jspdf';
import { supabase } from '../scripts/supabase'


const main = () => {

  // Este evento se dispara cuando el contenido cargue
  document.addEventListener('DOMContentLoaded', async () => {
    // Si el usuario no esta autenticado se enviara al login.
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('usuario no autenticado!')
        window.location.href = `${window.location.origin}/login.html`
      }

      // Obtener los datos del cronograma seleccionado
      const id = sessionStorage.getItem('cronograma-seleccionado')
      const { data, error } = await supabase.from('cronograma').select('*').eq('id', +id).single()

      if (error) {
        console.log(error)
        if (!data?.id) {
          alert(`El cronograma que estas buscando no existe, selecciona otro`)
          window.location.href = `${window.location.origin}/index.html`
          return
        }
        alert(`Hubo un error: ${error.details}`)
      }

      document.querySelector('#carrera').textContent = data.carrera
      document.querySelector('#elaboro').textContent = data.elaboro
      document.querySelector('#materia').textContent = data.materia
      document.querySelector('#docente').textContent = data.docente
      document.querySelector('#cuatrimestre').textContent = data.cuatrimestre
      document.querySelector('#fecha').textContent = data.fecha
      document.querySelector('#referencia').textContent = data.referencia
      document.querySelector('#grupos').textContent = data.grupos


    } catch (error) {
      console.log(error)
      alert(`Hubo un error: ${error.message}`)
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
