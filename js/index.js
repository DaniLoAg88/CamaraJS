let videoElemento = document.querySelector("#camara");
let btnTomarFoto = document.querySelector("#tomarFoto");
let btnBorrarTodo = document.querySelector("#borrarTodo");
let galeriaFotos = document.querySelector("#galeria");

//Solicitamos acceso a la cámara
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{videoElemento.srcObject=stream}).catch(error=>{alert("Error al acceder a la cámara" + error)});

//Declaración del contador de fotos para generar el ID y poder borrarlas y descargarlas.
let contadorIDfotos = tomarIdProximaFoto();

//Cuando pulsas en tomar foto se genera un canvas de tipo 2D con las coordenadas XY de la imagen de la cámara.
btnTomarFoto.addEventListener("click", ()=>{
    let canvas = document.createElement("canvas");
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeigth;

    const contexto = canvas.getContext("2d"); //Context es una propiedad de los canvas

    //Dibuja con todos los datos recogidos
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height); //Coge la imagen de videoElemento, empezando por la coordenada 0,0, con el ancho y el alto que le hemos dado al canvas

    //Prueba 
    galeriaFotos.appendChild(canvas);

    //Convertimos el canvas a Base64
    


});





function tomarIdProximaFoto() {
    
}