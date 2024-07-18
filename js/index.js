let videoElemento = document.querySelector("#camara");
let btnTomarFoto = document.querySelector("#tomarFoto");
let btnBorrarTodo = document.querySelector("#borrarTodo");
let galeriaFotos = document.querySelector("#galeria");

//Solicitamos acceso a la cámara
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{videoElemento.srcObject=stream}).catch(error=>{alert("Error al acceder a la cámara" + error)});

//Declaración del contador de fotos para generar el ID y poder borrarlas y descargarlas.
let contadorIDfotos = getNextPhoto();

//Cuando pulsas en tomar foto se genera un canvas de tipo 2D con las coordenadas XY de la imagen de la cámara.
btnTomarFoto.addEventListener("click", ()=>{
    let canvas = document.createElement("canvas");
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    const contexto = canvas.getContext("2d"); //Context es una propiedad de los canvas

    //Dibuja con todos los datos recogidos
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height); //Coge la imagen de videoElemento, empezando por la coordenada 0,0, con el ancho y el alto que le hemos dado al canvas

    //Convertimos el canvas a Base64
    let dataUrl = canvas.toDataURL("image/jpeg",0.9); /*Indicamos que convierta el canvas a una imagen JPEG con la ruta que vamos
    a establecer con el ID*/
    
    let photoID = contadorIDfotos++;

    //Funcion para guardar la foto
    guardarFoto({id:photoID,dataUrl}); //Mapa(clave:valor) con el ID y la ruta donde vamos a guardarla
    setNextPhoto(contadorIDfotos); //Se pasa el valor del contador de foto a una función, que prepara el contador para la próxima foto

});


function guardarFoto(photo, isPhotoLoad=false){ //El isPhotoLoad lo ponemos en False por defecto que significa que la foto no está ya cargada en el localStorage
                                                //ésto lo hacemos porque usamos la misma función para cargar las fotos de memoria cuando recargamos la página, y en ese momento no tiene que volver a guardarlas, sólo cargarlas en la página
    //Creamos el contenedor/div para la foto
    let photoContainer = document.createElement("div");
    photoContainer.className = "photo-container";
    photoContainer.dataset.id = photo.id;

    //Crear la imagen
    let img = new Image(); //Variable de tipo objeto Image
    img.src = photo.dataUrl;
    img.className = "photo";

    //Crear el contenedor/div para los botones
    let contenedorBotones = document.createElement("div");
    contenedorBotones.className = "botones-photo";

    //Creamos el botón eliminar
    eliminarPhoto = document.createElement("button");
    eliminarPhoto.className = "boton-eliminar";
    eliminarPhoto.textContent = "Eliminar";

    //Creamos el evento si pulsan éste botón
    eliminarPhoto.addEventListener("click", function(){
        eliminar(photo.id);
    });

    //Creamos el botón descargar
    let descargarPhoto = document.createElement("button");
    descargarPhoto.className = "boton-descargar";
    descargarPhoto.textContent = "Descargar";

    //Creamos el Evento de éste botón descargar
    descargarPhoto.addEventListener("click", function(){
        descargar(photo.dataUrl, `Galeria_Foto-${photo.id}.jpg`); //Le pasamos a la función descargar la url de la foto y el nombre que le queremos dar a la descarga
    });

    galeriaFotos.appendChild(photoContainer);
    photoContainer.appendChild(img);
    photoContainer.appendChild(contenedorBotones);
    contenedorBotones.appendChild(eliminarPhoto);
    contenedorBotones.appendChild(descargarPhoto);

    //Guardar la imagen en el almacenamiento local sólo si existe el map, si no lo creamos
    if(!isPhotoLoad){
        let fotos = JSON.parse(localStorage.getItem("fotos")) || []; //Si existe "fotos" devuelve map, si no existe lo crea vacío
        fotos.push(photo);
        localStorage.setItem("fotos", JSON.stringify(fotos));
    }
    
}

//Cuando carga la página debe mostrar todas las fotos guardadas en memoria....
//LEER el localStorage, coger las fotos almacenadas y mostrarlas en el navegador
let fotosGuardadas = JSON.parse(localStorage.getItem("fotos")) || [];
fotosGuardadas.forEach(element => {
    guardarFoto(element, true); //El true nos dice que ya está guardada, porque las hemos cogido del localStorage
});

function eliminar(id) {

    //Primero lo eliminamos de la vista en la página
    let divEliminar = document.querySelector(`.photo-container[data-id="${id}"]`);

    if(divEliminar){
        galeriaFotos.removeChild(divEliminar);
    }

    //Ahora las borramos del localStorage, se leen todas las fotos guardadas y se filtra el que sea igual al ID que se busca
    let fotos = JSON.parse(localStorage.getItem("fotos")) || [];

    fotos = fotos.filter(photo=>photo.id != id); /* Lo que hacemos aquí es aplicar un filtro que buscar todas las fotos con ID distinto
        al que pasamos para eliminar, y sobreescribimos el map con todos los resultados encontrados, por lo que en éste nuevo map no está
        el que queremos eliminar */

    localStorage.setItem("fotos", JSON.stringify(fotos)); //Y aquí grabamos en el localStorage el nuevo map sin esa foto a eliminar

}

function descargar(dataUrl, filename) {
    let elemento = document.createElement("a"); //Creamos un elemento de enlace
    elemento.href = dataUrl; //Le asignamos al elemento la url recibida de la foto
    elemento.download = filename; //Le asignamos al nombre de descarga el nombre que recibimos
    document.body.appendChild(elemento); //Se crea un elemento en el body (que no se muestra) para descargar
    elemento.click(); //Éste click es automático, no tenemos que darle nosotros en ningún momento
    document.body.removeChild(elemento); //Se elimina el elemento que creó para hacer la descarga
}


function getNextPhoto() {
    return parseInt(localStorage.getItem("contadorIDfotos")) || 0;
    //Devolvemos el contador y si no existe devolvemos 0
}

function setNextPhoto(id) {
    localStorage.setItem("contadorIDfotos", id.toString());
}


btnBorrarTodo.addEventListener("click", function(){
    //Eliminamos todos los div de la galeria
    while(galeriaFotos.firstChild){
        galeriaFotos.removeChild(galeriaFotos.firstChild);
    }

    //Eliminamos todo lo de localStorage
    localStorage.removeItem("fotos");

    //Ponemos el contador de IDs a cero
    contadorIDfotos = 0;

    //Llamamos a la función de poner el siguiente ID a 0
    setNextPhoto(0);
});