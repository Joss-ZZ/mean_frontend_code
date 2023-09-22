export function brightness(rgb: string): string {
	const colors = rgb
		.substring(3)
		.replace('(', '')
		.replace(')', '')
		.split(',')
		.map((color) => parseInt(color));

	let brightness = colors[0] * 299 + colors[1] * 587 + colors[2] * 114;
	brightness = brightness / 255000;

	// values range from 0 to 1
	// anything greater than 0.5 should be bright enough for dark text
	return brightness >= 0.5 ? '#000' : '#fff';
}

export function dataURItoBlob(dataURI: string): Blob {
	// Extrae la sección de datos base64 de la cadena
	const base64Data = dataURI.split(",")[1];
  
	// Convierte los datos base64 en una cadena de bytes
	const byteString = atob(base64Data);
  
	// Crea un objeto Uint8Array a partir de la cadena de bytes
	const byteArray = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
	  byteArray[i] = byteString.charCodeAt(i);
	}
  
	// Obtén el tipo de archivo de la imagen desde el archivo
	const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  
	// Crea un objeto Blob a partir del Uint8Array y especifica el tipo de archivo
	return new Blob([byteArray], { type: mimeString });
}