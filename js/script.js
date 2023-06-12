import { DESCUENTOS, CATEGORIAS } from './constantes.js';
import { esNombreOApellidoValido, esMailValido, esNumeroEnteroValido, esCategoriaValida } from './verificarDatos.js';
import { generarTotal } from './total.js';
const formVenta = document.getElementById('formVenta');
const categorias = document.getElementById('categorias');

const { getTotal, resetTotal, calcularTotal } = generarTotal();

/**
 * Recibe un numero y devuelce un string con el formato de la moneda argentina
 * @param {number} numero 
 * @returns retorna un string con el formato de moneda
 */
const formatearNumero = (numero) => numero.toLocaleString('es-ar', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

/**
 * Cambia una clase de un elemento html segun el parametro esValida, true cambia a 'is-valid' y false a 'is-invalid' 
 * @param {HTMLInputElement | HTMLSelectElement} elemento 
 * @param {boolean} esValida 
 */
const cambiarClaseValida = (elemento, esValida) => {
    
    if (esValida) {
        elemento.classList.remove('is-invalid');
        elemento.classList.add('is-valid');

    } else {
        elemento.classList.remove('is-valid');
        elemento.classList.add('is-invalid');
    }
}

/**
 * Agrega o quita la clase 'd-none' del elemento html hermano que tengala clase errorInput, segun el parametro esError,
 * true quita 'd-none' y false agrega 'd-none', se puede pasar un mensaje de error.
 * @param {HTMLElement} element 
 * @param {boolean} esError 
 * @param {string} textError 
 */
const cambiarClaseError = (element, esError, textError = '') => {

    const errorElem = element.parentElement.querySelector('.errorInput');

    if (esError) {
        errorElem.classList.add('d-none');

    } else {
        errorElem.classList.remove('d-none');
    }
    errorElem.innerText = textError;
}

/**
 * Busca dentro de form los elementos y inputs con la clase 'errorInput' y 'inputForm' y elimina sus clases agregadas
 * @param {HTMLFormElement} form 
 */
const borrarErrores = (form) => {

    const arrayElemErrores = form.querySelectorAll('.errorInput');
    const arrayInputs = form.querySelectorAll('.inputForm');

    for (const elem of arrayElemErrores) {
        if (!elem.classList.contains('d-none')) {
            cambiarClaseError(elem, false);
        }
    }

    for (const elem of arrayInputs) {
        elem.classList.remove('is-invalid');
        elem.classList.remove('is-valid');        
    }
}

/**
 * Recibe elemento html y una funcion para verificar si el valor es valido, puede recibir 2 string 
 * en caso del valor no ser valido o si esta vacio
 * @param {HTMLInputElement | HTMLSelectElement} elemento 
 * @param {Function} fnValidarDato 
 * @param {string | null} msgError 
 * @param {string | null} msgCampoVacio 
 * @returns retorno true si el valor del elemento es valido o false al contrario
 */
const validarCampoYCambiarClase = (elemento, fnValidarDato, msgError, msgCampoVacio) => {

    let retorno = fnValidarDato(elemento?.value);

    if(elemento.value === '') {
        cambiarClaseValida(elemento, false);
        cambiarClaseError(elemento, false, msgCampoVacio ? msgCampoVacio : `Debe ingresar un dato para ${elemento?.id}`);
        retorno = false;
    } else if (!retorno) {
        cambiarClaseValida(elemento, retorno);
        cambiarClaseError(elemento, retorno, msgError ? msgError : `Dato invalido para ${elemento?.id}`);
    } else {
        cambiarClaseValida(elemento, retorno);
        cambiarClaseError(elemento, retorno);
    }
    return retorno;
}

/**
 * Ejecuta la funcion validarCampoYCambiarClase con diferentes parametros y callback(para veficar datos)
 * segun el id del elemento recibido.
 * @param {HTMLInputElement | HTMLSelectElement} elemento 
 * @returns retorno true si el valor del elemento es valido o false al contrario.
 */
const ejecutarFuncionSegunCampo = (elemento) => {

    let retorno = false;
    switch (elemento.id) {
        case 'nombre':
            retorno = validarCampoYCambiarClase(elemento, esNombreOApellidoValido, 'Nombre invalido, no debe contener espacios o numeros')
            break;
        case 'apellido':
            retorno = validarCampoYCambiarClase(elemento, esNombreOApellidoValido, 'Apellido invalido, no debe contener espacios o numeros')
            break;
        case 'mail':
            retorno = validarCampoYCambiarClase(elemento, esMailValido, 'Mail invalido, el fomato debe ser nombreejemplo@correo.com')
            break;
        case 'cantidad':
            retorno = validarCampoYCambiarClase(elemento, esNumeroEnteroValido, 'Cantidad invalida, debe ser un numero entero')
            break;
        case 'categoria':
            retorno = validarCampoYCambiarClase(elemento, esCategoriaValida, 'Categoria invalida')
            break;
        default:
            retorno = false;
            break;
    }

    return retorno;
}

/**
 * Recorre los elementos html con la clase 'inputForm'(inputs y select) y ejecuta la
 * funcion, segun el id, para verificar el valor y muestra el error si hay
 * @param {HTMLFormElement} form 
 * @returns Retorna true si todo los campos son valido y false al contrario
 */
const validarCampos = (form) => {

    let retorno = true;
    const arrayInputs = form.querySelectorAll('.inputForm');
    
    arrayInputs.forEach(input => {
        
        if (!ejecutarFuncionSegunCampo(input) && retorno) {
            retorno = false;
        }

    });

    return retorno;
}

/**
 * Agregue un EventListener al form para el evento reset, para que ademas resetee el total a cero
 * y quite las clases agregada para mostrar errores y exitos
 */
formVenta.addEventListener('reset', function () {
    borrarErrores(this);
    resetTotal();
    this.querySelector('#importe').innerText = formatearNumero(getTotal());
});

/**
 * Agregue un EventListener al form para el evento submit, que lo va a prevenir, evalua que los
 * campos del form sean valido si lo son muestra el total y caso contrario muestra los errores
 */
formVenta.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validarCampos(this)) {
        const categoria = this.querySelector('#categoria').value;
        const cantidad = this.querySelector('#cantidad').value;
        this.querySelector('#importe').innerText = formatearNumero( calcularTotal(+cantidad, DESCUENTOS[categoria]) );
        
    }

});

formVenta.addEventListener('change', (event) => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('inputForm')) {
        if (target.value === '') {
            target.classList.remove('is-invalid');
            target.classList.remove('is-valid');
            cambiarClaseError(target, false);
        } else {
            
            ejecutarFuncionSegunCampo(target);
        }
    }
});

/**
 * Agrego un Event Listener al elemento que contiene las card categorias, en caso que el elemento clickeado posea
 * la clase 'cardCategoria' o sea hijo, se cambia la seleccionada en el select
 */
categorias.addEventListener('click', (event) => {

    event.preventDefault();
    const target = event.target.closest('.cardCategoria');
    const elemSelect = formVenta.querySelector('#categoria');

    if (target.classList.contains(CATEGORIAS.ESTUDIANTE.toLowerCase())) {
        elemSelect.value = CATEGORIAS.ESTUDIANTE;

    } else if (target.classList.contains(CATEGORIAS.TRAINEE.toLowerCase())) {
        elemSelect.value = CATEGORIAS.TRAINEE;

    } else if (target.classList.contains(CATEGORIAS.JUNIOR.toLowerCase())) {
        elemSelect.value = CATEGORIAS.JUNIOR;

    }

})