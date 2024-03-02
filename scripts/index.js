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
    }
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