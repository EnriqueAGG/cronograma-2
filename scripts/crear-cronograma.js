
import * as bootstrap from 'bootstrap'

import { supabase } from '../scripts/supabase'

const main = () => {

  // obtenemos el formulario
  const formulario = document.querySelector('#form-crear-cronograma')

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

    // TODO: aquí podemos hacer más validaciones para los campos (Ej: el campo cuatrimestre debe ser un número, etc.)


    // si hay campos vacíos, mostrar alerta y no ejecutar nada más
    if (errors) {
      alert('Todos los campos son obligatorios 🚨')
      return
    }

    // obtenemos la alerta y se inicializa para poder usar sus métodos
    const $toast = document.querySelector('.toast')
    const toast = new bootstrap.Toast($toast)

    try {

      // TODO: guardar los datos en supabase.
      const { data, error } = await supabase.from('').insert({ ...inputsFormulario })

      // Si hay un error al querer guardar en base de datos, mostrar mensaje
      if (error) {
        showError(error, $toast, toast)
        return
      }

      // Si todo sale bien
      // mostrar la alerta para avisar que se creo el cronograma
      console.log(data)

      $toast.classList.add('text-bg-success')
      $toast.querySelector('.toast-title').textContent = 'Cronograma creado!'
      $toast.querySelector('.toast-body').textContent = 'El cronograma fue creado correctamente'
      toast.show()


      // reset el formulario al final
      formulario.reset()
    } catch (error) {
      // Si algo falla al guardar en base de datos, mostrar un mensaje de error
      showError(error, $toast, toast)
    }


  })


  const showError = (error, $toast, toast) => {
    console.log(error)
    $toast.classList.add('text-bg-danger')
    $toast.querySelector('.toast-title').textContent = 'Ups hubo un error!'
    $toast.querySelector('.toast-body').textContent = 'No se ha podido crear el cronograma, inténtelo más tarde'
    toast.show()
  }
}



main()