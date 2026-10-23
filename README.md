# sur — tienda de indumentaria

Tienda estática hecha con HTML, CSS y JavaScript, lista para publicar en GitHub Pages. No tiene backend: el catálogo es público y editable en `products.json`, el carrito se guarda en el navegador con `localStorage` y el cierre de pedidos se deriva a WhatsApp. Las imágenes editoriales se sirven desde Unsplash y necesitan conexión a internet; las ilustraciones SVG locales quedan como respaldo si una foto no carga.

## Publicar

Subí todos los archivos del proyecto a un repositorio de GitHub. En **Settings → Pages**, elegí la rama principal y la carpeta raíz (`/`). Como el catálogo se carga con `fetch`, abrí el sitio mediante GitHub Pages o un servidor local; abrir `index.html` directamente como archivo puede bloquear la carga de `products.json`.

## Configurar pedidos

Editá `store-config.js` y reemplazá `WHATSAPP_NUMBER` por el número de la tienda en formato internacional, sin el signo `+`, espacios ni guiones. Ejemplo de Argentina: `5491123456789`. El botón arma un mensaje con los productos, talles, cantidades y subtotal. El comprador y la tienda coordinan envío y pago en la conversación.

## Agregar prendas

1. Copiá una imagen a `assets/` (SVG, WebP, JPG o PNG funcionan en el catálogo).
2. Agregá un objeto al array de `products.json`, separado por una coma. Ejemplo:

```json
{
  "id": "campera-viento",
  "name": "Campera Viento",
  "category": "unisex",
  "type": "Campera",
  "price": 99000,
  "color": "Piedra",
  "colorHex": "#a69d8d",
  "sizes": ["S", "M", "L", "XL"],
  "description": "Descripción breve de materiales y calce.",
  "image": "assets/campera-viento.webp",
  "alt": "Campera color piedra en vista frontal",
  "featured": 9
}
```

`id` debe ser único. `category` acepta `mujer`, `hombre` o `unisex`. `compareAt` es opcional y muestra un precio anterior; `badge` también es opcional. `image` acepta una URL o ruta local; `fallbackImage` apunta a la ilustración local que se muestra si la foto remota falla. Las fotos actuales son referencias editoriales y no corresponden necesariamente a la prenda de cada SKU. Antes de vender, reemplazalas por fotos propias o de producto autorizado.

## Fotografías y créditos

Las fotografías están publicadas bajo la [licencia de Unsplash](https://unsplash.com/license), que permite la mayoría de usos comerciales. Se enlazan desde Unsplash y cada registro conserva su URL de origen en `imageCredit`.

- Remera clara: Derick McKinney — [Unsplash](https://unsplash.com/photos/white-crew-neck-shirt-on-hanger-cmbbXRjYUZA)
- Camiseta verde: Miguel Dominguez — [Unsplash](https://unsplash.com/photos/man-wearing-green-and-yellow-crew-neck-t-shirt-facing-his-left-side-olBWIB37zWo)
- Look de camisa y pantalón: Ramo Roso — [Unsplash](https://unsplash.com/photos/woman-in-white-shirt-and-black-wide-leg-pants-9E7s5oyDmxg)
- Top y pantalón rosa: Engin Akyurt — [Unsplash](https://unsplash.com/photos/woman-in-white-top-and-trousers-WroHMbuh3Mg)
- Sweater claro: Saket Krishnam — [Unsplash](https://unsplash.com/photos/a-woman-posing-for-a-picture-in-a-white-sweater-lDHNphcBKrI)
- Vestido en percha: Jonathan Borba — [Unsplash](https://unsplash.com/photos/a-dress-hanging-on-a-hanger-next-to-a-chair-v_NAcAeB_Kg)
- Remera oscura: Sammy Chandio — [Unsplash](https://unsplash.com/photos/man-wearing-black-crew-neck-t-shirt-xmbL3d1gE5Q)
- Camisa celeste: Joshua Thomas — [Unsplash](https://unsplash.com/photos/white-and-blue-shirt-on-clothes-hanger-dxsgEdYJJVM)

## Pagos y envíos

GitHub Pages no procesa pagos ni protege secretos. No ingreses claves privadas, CBU o credenciales en el JavaScript público. Para cobrar, coordiná un link de pago oficial de Mercado Pago o transferencia por WhatsApp; las cuotas mostradas en la franja superior son una referencia comercial editable y deben coincidir con la promoción real antes de publicar. El costo de envío se confirma al cerrar el pedido.
# sur-
# sur-
