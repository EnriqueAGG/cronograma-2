import * as bootstrap from 'bootstrap'
import { supabase } from '../scripts/supabase'

const main = () => {

  // Si el usuario no esta autenticado se enviara al login.
  // Este evento se dispara cuando el contenido cargue
  document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.log('usuario no autenticado!')
      window.location.href = `${window.location.origin}/login.html`
      return
    }

    // obtener todos los cronogramas 
    const { data, error } = await supabase.from('cronograma').select('*')

    let template = ''
    data.map(({
      id,
      carrera,
      elaboro,
      materia,
      docente,
      cuatrimestre,
      fecha,
      referencia,
      grupos
    }) => {
      template += `
      <li
        id="${id}"
        class="cronograma-item border border-dark p-3 rounded btn w-100 text-start btn-secondary d-flex flex-column gap-1">
        <span class="fw-bold fs-5">${carrera}</span>
        <span class="fs-6">${materia}</span>
        </li> 
        <button id="borrarCronograma" class="hide-pdf btn btn-primary">BORRAR</button>
         `
    })
    // mostrar los cronogramas en pantalla
    document.querySelector('#lista-cronogramas').innerHTML = template

    
    
    // obtener todos los botones
    document.querySelectorAll('.cronograma-item').forEach(cronograma => {
      // al dar click al boton te envia a cronograma.html y te muestra el cronograma que seleccionaste
      cronograma.addEventListener('click', () => {
        console.log('click')
        sessionStorage.setItem('cronograma-seleccionado', cronograma.id)
        window.location.href = `${window.location.origin}/cronograma.html`
      })
    })
  })



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



