const btnToAdd = document.getElementById('addToCart');

const cart_id = document.getElementById('cart_id');
const product_id = document.getElementById('product_id');

btnToAdd.addEventListener('click', ()=>{
    fetch(`/api/carts/${cart_id.value}/product/${product_id.value}`, {method: 'POST'})
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'success'){
                Swal.fire({
                    text: `Producto agregado al carrito.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(()=>{
                    location.href = '/';
                })
            }else if(data.status === 'error'){
                Swal.fire({
                    text: 'No se pudo agregar el producto a su carrito, solo usuarios pueden realizar esta funcion.',
                    icon: 'warning',
                    timer: 1500,
                    showConfirmButton: false
                })
            }
        })
})