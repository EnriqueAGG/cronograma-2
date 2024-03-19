import { supabase } from './supabase'

// LOGIN
const formLogin = document.querySelector('#form-login')
formLogin.addEventListener('submit', async (e) => {

  e.preventDefault()

  const email = formLogin.querySelector('#email').value
  const password = formLogin.querySelector('#password').value

  const errorMessage = document.querySelector('#error-message')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })


  if (data.session) {
    sessionStorage.setItem('user', data.user)
    window.location.href = `${window.location.origin}/index.html`
    return
  }

  if (error) {
    errorMessage.style.display = 'block'

    errorMessage.querySelector('button').addEventListener('click', () => {
      errorMessage.style.display = 'none'
    })
    errorMessage.querySelector('span').textContent = error.message
  }
})
