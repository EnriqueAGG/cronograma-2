// TODO: obtener el ID del cronograma al que le quieres agregar la nueva fila
import * as bootstrap from 'bootstrap'

import { supabase } from '../scripts/supabase'

const main = () => {

  // Este evento se dispara cuando el contenido cargue
  document.addEventListener('DOMContentLoaded', async () => {
    // Si el usuario no esta autenticado se enviara al login.
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      console.log('usuario no autenticado!')
      window.location.href = `${window.location.origin}/login.html`
      return
    }

    // Para agregar una nueva fila debe seleccionar un cronograma antes.
    // Por lo cual si no ha seleccionado uno, se reemviara al index para que seleccione un cronograma y agregue una nueva fila
    const id = sessionStorage.getItem('cronograma-seleccionado')
    if (!id) {
      alert(`El cronograma que estas buscando no existe, selecciona otro`)
      window.location.href = `${window.location.origin}/index.html`
      return
    }
  })

  // obtenemos el formulario
  const formulario = document.querySelector('#form-nueva-fila')

  // ejecutar acciones cuando se haga submit del formulario
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    // obtener los valores de los campos dentro del form
    const inputsFormulario = Object.fromEntries(new FormData(e.target))

    // validar que no haya campos vacíos
    let errors = 0
    for (const key in inputsFormulario) {
      if (inputsFormulario[key].length <= 0) {
        errors++
      }
    }

    // TODO: aquí podemos hacer más validaciones para los campos


    // si hay campos vacíos, mostrar alerta y no ejecutar nada más
    if (errors) {
      alert('Todos los campos son obligatorios 🚨')
      return
    }
    // obtenemos la alerta y se inicializa para poder usar sus métodos

    const $toast = document.querySelector('.toast')
    const toast = new bootstrap.Toast($toast)

    try {

      // transformar los datos. para guardarlos correctamente en la BD
      const nuevaFila = formatearDatos(inputsFormulario)

      const id = sessionStorage.getItem('cronograma-seleccionado')
      // TODO: guardar los datos en supabase.
      const cronograma = await supabase.from('cronograma').select('*').eq('id', id).single()

      const filasAnteriores = cronograma.data.filas !== null ? JSON.parse(cronograma.data.filas) : []

      const cronogramaActualizado = {
        ...cronograma.data,
        filas: JSON.stringify([...filasAnteriores, { ...nuevaFila }])
      }

      const { data, error } = await supabase.from('cronograma').update({ ...cronogramaActualizado }).eq('id', id)

      // Si hay un error al querer guardar en base de datos, mostrar mensaje
      if (error) {
        showError(error, $toast, toast)
        return
      }

      // Si todo sale bien
      // mostrar la alerta para avisar que se creo el cronograma
      console.log(data)

      $toast.classList.add('text-bg-success')
      $toast.querySelector('.toast-title').textContent = 'Cronograma actualizado!'
      $toast.querySelector('.toast-body').textContent = 'Se agrego una nueva fila al cronograma'
      toast.show()

      // reset el formulario al final
      formulario.reset()
    } catch (error) {
      // Si algo falla al guardar en base de datos, mostrar un mensaje de error
      showError(error, $toast, toast)
    }


    const cerrarSesion = async () => {
      // al dar click al boton "cerrar sesion" se elimina la sesion de supabase y los datos guardados del usuario, para ser enviado al login
      document.querySelector('#btn-logout').addEventListener('click', async () => {
        await supabase.auth.signOut()
        sessionStorage.removeItem('user')
        window.location.href = `${window.location.origin}/login.html`
      })
    }
    cerrarSesion()

  })

  const formatearDatos = (inputsFormulario) => {

    const [year1, month1, day1] = inputsFormulario['fecha-inicio'].split('-')
    const [year2, month2, day2] = inputsFormulario['fecha-final'].split('-')

    const date1 = new Date(+year1, +month1 - 1, +day1)
    const date2 = new Date(+year2, +month2 - 1, +day2)

    const d1 = date1.getUTCDate()
    const d2 = date2.getUTCDate()
    const m1 = date1.toLocaleDateString('es-MX', { month: 'long' }).toLocaleUpperCase()
    const m2 = date2.toLocaleDateString('es-MX', { month: 'long' }).toLocaleUpperCase()

    const fecha = m1 === m2
      ? `${d1} - ${d2} \n ${m1}`
      : `${d1} ${m1} - ${d2} ${m2}`

    const nuevaFila = {
      id: `${crypto.randomUUID()}`,
      sesion: `${inputsFormulario.sesion} HRS`,
      fecha,
      p: inputsFormulario['hora-t'],
      t: inputsFormulario['hora-p'],
      metodos: inputsFormulario['metodos'],
      saber: inputsFormulario['saber-hacer'],
      temas: inputsFormulario['temas'],
      evaluacion: inputsFormulario['evaluacion'],
    }

    return nuevaFila
  }

  const showError = (error, $toast, toast) => {
    console.log(error)
    $toast.classList.add('text-bg-danger')
    $toast.querySelector('.toast-title').textContent = 'Ups hubo un error!'
    $toast.querySelector('.toast-body').textContent = 'No se ha podido actualizar el cronograma, inténtelo más tarde'
    toast.show()
  }
}

main()