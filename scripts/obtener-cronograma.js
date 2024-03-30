
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

      const intl = new Intl.DateTimeFormat()

      document.querySelector('#carrera').textContent = data.carrera
      document.querySelector('#elaboro').textContent = data.elaboro
      document.querySelector('#materia').textContent = data.materia
      document.querySelector('#docente').textContent = data.docente
      document.querySelector('#cuatrimestre').textContent = data.cuatrimestre
      document.querySelector('#fecha').textContent = intl.format(new Date(`${data.fecha} `))
      document.querySelector('#referencia').textContent = data.referencia
      document.querySelector('#grupos').textContent = data.grupos

  

      console.log(data.filas);
      if (data.filas !== null) {
        let filas = ''
        JSON.parse(data.filas).map(({
          id,
          sesion,
          fecha,
          p,
          t,
          metodos,
          saber,
          temas,
          evaluacion,
        }) => {
          filas += `
            <tr class="border border-dark position-relative">
            <td class="border border-dark">
            <button data-id="${id}"  class="btn-eliminar-fila hide-pdf">
            <img src="/icons8-cerrar-ventana-48.png" style="width:18px" />
            </button>
                <textarea class="ta d-none ta-sesion-${id}" >${sesion}</textarea>
                <span class="item-show d-block">${sesion}</span>
              </td>
              <td class="border border-dark text-center">
                <textarea class="ta d-none ta-fecha-${id}" >${fecha}</textarea>
                <span class=" item-show d-block">${fecha}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-temas-${id}" >${temas}</textarea>
                <span class=" item-show d-block">${temas}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-saber-${id}" >${saber}</textarea> 
                <span class=" item-show d-block">${saber}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-metodos-${id}" >${metodos}</textarea>
                <span class=" item-show d-block">${metodos}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-evaluacion-${id}" >${evaluacion}</textarea>
                <span class=" item-show d-block">${evaluacion}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-p-${id}" >${p}</textarea>
                <span class=" item-show d-block">${p}</span>
              </td>
              <td class="border border-dark">
                <textarea class="ta d-none ta-t-${id}" >${t}</textarea>
                <span class=" item-show d-block">${t}</span>
                <button data-id="${id}"  class="btn-editar-fila hide-pdf" >Editar</button>
              </td>
            </tr> 
          `
        })
        document.querySelector('#table-body').innerHTML = filas
      }

      // editar fila
      document.querySelectorAll('.btn-editar-fila').forEach( btn => {
        btn.addEventListener('click', async() => {

          if(btn.textContent === 'Editar'){
            btn.textContent = 'Guardar';
            btn.style.right =  '-60px';
            btn.parentElement.parentElement.querySelectorAll('.item-show').forEach( span =>  {
              span.classList.remove('d-block')
              span.classList.add('d-none')
            })
            btn.parentElement.parentElement.querySelectorAll('.ta').forEach( textarea =>  {
              textarea.classList.add('d-block')
              textarea.classList.remove('d-none')
            })
            
          }else {
            btn.style.right =  '-50px';
            btn.parentElement.parentElement.querySelectorAll('.item-show').forEach( span =>  {
              span.classList.add('d-block')
              span.classList.remove('d-none')
            })
            btn.parentElement.parentElement.querySelectorAll('.ta').forEach( textarea =>  {
              textarea.classList.remove('d-block')
              textarea.classList.add('d-none')
            })

            const id = sessionStorage.getItem('cronograma-seleccionado')

            const cronograma = await supabase.from('cronograma').select('*').eq('id', id).single()
            
            const newFilas = JSON.parse(cronograma.data.filas).map( fila =>  {

              if(fila.id === btn.dataset.id){
                fila.sesion = document.querySelector(`.ta-sesion-${btn.dataset.id}`).value
                fila.fecha = document.querySelector(`.ta-fecha-${btn.dataset.id}`).value
                fila.p = document.querySelector(`.ta-p-${btn.dataset.id}`).value
                fila.t = document.querySelector(`.ta-t-${btn.dataset.id}`).value
                fila.metodos = document.querySelector(`.ta-metodos-${btn.dataset.id}`).value
                fila.saber = document.querySelector(`.ta-saber-${btn.dataset.id}`).value
                fila.temas = document.querySelector(`.ta-temas-${btn.dataset.id}`).value
                fila.evaluacion = document.querySelector(`.ta-evaluacion-${btn.dataset.id}`).value
              }
              return fila
            })
            
            const cronogramaActualizado = {
              ...cronograma.data,
              filas: JSON.stringify([...newFilas])
            }

            const { data, error } = await supabase.from('cronograma').update({ ...cronogramaActualizado }).eq('id', id)

            btn.textContent = 'Editar'

            if(!error){
              console.log(data);
            
              document.querySelector(`.ta-sesion-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-sesion-${btn.dataset.id}`).value
              document.querySelector(`.ta-fecha-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-fecha-${btn.dataset.id}`).value
              document.querySelector(`.ta-p-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-p-${btn.dataset.id}`).value
              document.querySelector(`.ta-t-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-t-${btn.dataset.id}`).value
              document.querySelector(`.ta-metodos-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-metodos-${btn.dataset.id}`).value
              document.querySelector(`.ta-saber-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-saber-${btn.dataset.id}`).value
              document.querySelector(`.ta-temas-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-temas-${btn.dataset.id}`).value
              document.querySelector(`.ta-evaluacion-${btn.dataset.id}`).parentElement.children[1].textContent = document.querySelector(`.ta-evaluacion-${btn.dataset.id}`).value

              alert('Fila actualizada')

            }
          }

        })
      })

      // eliminar fila
      document.querySelectorAll('.btn-eliminar-fila').forEach( btn  => {
        btn.addEventListener('click', async()=> {

          const id = sessionStorage.getItem('cronograma-seleccionado')

          const cronograma = await supabase.from('cronograma').select('*').eq('id', id).single()
          
          const newFilas = JSON.parse(cronograma.data.filas).filter( fila => fila.id != btn.dataset.id )
          
          const cronogramaActualizado = {
            ...cronograma.data,
            filas: JSON.stringify([...newFilas])
          }

          const { data, error } = await supabase.from('cronograma').update({ ...cronogramaActualizado }).eq('id', id)

          if(!error){
            console.log(data);
          
            alert('Fila Eliminada')
            btn.parentElement.parentElement.remove()
          }

        })
      })

    } catch (error) {
      console.log(error)
      alert(`Hubo un error: ${error.message}`)
    }
  })



  const imprimirPDF = () => {
    document.querySelector('#imprimir-pdf').addEventListener('click', async () => {

      // ocultar botones antes de imprimir
      document.querySelectorAll('.hide-pdf').forEach(btn => {
        btn.style.display = 'none'
      })

      const opt = {
        margin: 1,
        filename: `${crypto.randomUUID()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
      };

      const a = await html2pdf().set(opt).from(document.querySelector('main')).toPdf().get('pdf')
      let totalPages = a.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        await a.setPage(i);
        await a.setFontSize(10);
        await a.setTextColor(0,0,0);
        
        console.log(a.internal.pageSize.getWidth()); //14
        console.log(a.internal.pageSize.getHeight()); //8.5
        
        await a.text("R 05/1213", 0.5, 8.1);
        await a.text("F-DC-16", 10, 8.1);
        
      }
      await a.save()

      // volver a colcoar botones 
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
