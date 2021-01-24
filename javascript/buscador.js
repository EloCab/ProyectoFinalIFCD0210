const DIR_SERVICIO_ITUNES = "https://itunes.apple.com/search/?media=music&term="
var xhr = new XMLHttpRequest();//ajax

function buscarCanciones() {
    let termino = document.getElementById("busqueda").value;
    //HACEMOS LA PETICIÓN; COMPONEMOS LA URL
    let url = DIR_SERVICIO_ITUNES + termino;
    let url_formateada = encodeURI(url);

    //LLAMAMOS
    xhr.open('GET', url_formateada);
    xhr.onreadystatechange = mostrarResultados;
    xhr.send();
}

function crearTd(inner) {
    var nuevo_td;

    nuevo_td = document.createElement("td");
    nuevo_td.innerHTML = inner;

    return nuevo_td;
}

function crearTdImg(src_imagen) {
    var td_caratula;
    let img_caractula;

    img_caractula = document.createElement("img");
    img_caractula.src = src_imagen;
    //img_caractula.setAttribute("src", src_imagen );
    td_caratula = crearTd("");
    td_caratula.appendChild(img_caractula);

    return td_caratula;
}

function crearTdAudio(src_audio) {
    var td_audio;
    let audio_element;

    audio_element = document.createElement("audio");
    audio_element.src = src_audio;
    audio_element.setAttribute("controls", true);
    td_audio = crearTd("");

    td_audio.appendChild(audio_element);

    return td_audio;
}

function mostrarCancion(cancion) {
    //CREAMOS LOS TD'S
    var td_artista = crearTd(cancion.artistName);
    var td_nombre_cancion = crearTd(cancion.trackName);
    var td_nombre_album = crearTd(cancion.collectionName);
    var td_caratula = crearTdImg(cancion.artworkUrl100);
    var td_muestra_cancion = crearTdAudio(cancion.previewUrl);

    //CREAMOS LA NUEVA FILA
    var tr_cancion = document.createElement("tr");
    tr_cancion.appendChild(td_artista);
    tr_cancion.appendChild(td_nombre_cancion);
    tr_cancion.appendChild(td_nombre_album);
    tr_cancion.appendChild(td_caratula);
    tr_cancion.appendChild(td_muestra_cancion);


    //AÑADIMOS LA NUEVA FILA (CANCIÓN) A LA TABLA 
    let tabla_canciones = document.getElementById("tablaCanciones");
    tabla_canciones.appendChild(tr_cancion);
}

function ordenar(a, b) {
    let numero_devuelto;
    var x = a.trackName.toLowerCase();
    var y = b.trackName.toLowerCase();

    if (x < y) {
        numero_devuelto = -1;
    }
    else if (x > y) {
        numero_devuelto = 1;
    }
    else {
        numero_devuelto = 0;
    }

    return numero_devuelto;
}

function ordenarCanciones() {
    let resultados_busqueda = JSON.parse(xhr.responseText);
    //BORRAMOS LA TABLA QUE HAY EN PANTALLA
    document.getElementById("tablaCanciones").innerHTML = "";

    //ORDENAMOS POR CANCIÓN
    resultados_busqueda.results.sort(ordenar);

    if (resultados_busqueda.resultCount == 0) {
        alert("No se han podido ordenar los resultados");
    }
    else {
        //MOSTRAMOS LA TABLA ORDENADA
        for (let i = 0; i < resultados_busqueda.resultCount; i++) {
            mostrarCancion(resultados_busqueda.results[i]);
        }
    }
}


function mostrarResultados() {
    if (xhr.readyState == 4) {
        //HEMOS RECIBIDO RESPUESTA
        if (xhr.status == 200) {
            //LA RESPUESTA ES BUENA

            let resultados_busqueda = JSON.parse(xhr.responseText);
            if (resultados_busqueda.resultCount == 0) {
                alert("No hay resultados para la búsqueda solicitada");
            }
            else {
                for (let i = 0; i < resultados_busqueda.resultCount; i++) {
                    mostrarCancion(resultados_busqueda.results[i]);
                }
            }

        } else {
            if (xhr.status == 404) {
                alert("la URL especificada para la solicitud ajax no se encontró");
            }
            else {
                if (xhr.status == 500) {
                    alert("Ocurrió un error interno del servidor");
                }
            }
        }
    }
}

function LimpiarDatos() {
    location.reload();
}

        