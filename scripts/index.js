import { supabase } from "./supabase";


//Crear usuario
document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    console.log(email, password)

    const { data, error } = await supabase.auth.signUp({
        email,
        password, options: {emailRedirectTo:"http://localhost:5173/crear.html"

    }
    })
    
   if(!error) {
    alert('Revise su correo')
   }
})


// LOGIN
document.getElementById('form-lg').addEventListener('submit', async(e) => {
    e.preventDefault()
    const email = document.getElementById('email-lg').value
    const password = document.getElementById('password-lg').value
    console.log(email, password)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    
    if(data.session) {
        window.location.href = 'http://localhost:5173/crear.html'
    }
})

$(document).ready(function(){
    $('#switchToggle').change(function(){
      if(this.checked) {
        $('#login-form').show();
        $('#signup-form').hide();
      } else {
        $('#login-form').hide();
        $('#signup-form').show();
      }
    });
  });