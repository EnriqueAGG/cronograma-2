import { supabase } from "./supabase";


//Crear usuario
const formSignup = document.querySelector('#form-signup')

formSignup.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = formSignup.querySelector('#email').value
  const password = formSignup.querySelector('#password').value

  const errorMessage = formSignup.querySelector('#error-message')
  const successMessage = formSignup.querySelector('#success-message')

  const { error } = await supabase.auth.signUp({
    email,
    password, options: {
      emailRedirectTo: `${window.location.origin}/cronograma.html`
    }
  })

  if (!error) {
    successMessage.textContent = 'Revise su bandeja para confirmar su correo electrónico'
    return
  }

  errorMessage.style.display = 'block'

  errorMessage.querySelector('button').addEventListener('click', () => {
    errorMessage.style.display = 'none'
  })

  errorMessage.querySelector('span').textContent = error.message

})


