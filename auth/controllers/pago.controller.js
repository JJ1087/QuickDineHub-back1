
const mercadopago = require("mercadopago");
const Product = require('../models/auth.modelMenu'); 
exports.getData = async (req, res) => {
  // let dataProductos = [];
  // for(let i = 0; i<req.body.productos.length; i++) {
  //   const products = await Product.findOne({_id:req.body.productos[i].id})
  //   dataProductos.push({
  //     id:products._id,
  //     title: products.nombre,
  //     quantity: req.body.productos[i].cantidad,
  //     unit_price: parseInt(products.precio),
  //   })
  // }
  let itemsProducts = [
    {
      title:'Productos',
      quantity:1,
      unit_price:req.body.total_pago
    }
  ]
  console.log(itemsProducts)
   const client = new mercadopago.MercadoPagoConfig({
     accessToken:
       "TEST-1175297249318297-030816-e2ab1189bd638ddccd10514d28dab4cb-1719437028",
   });

   const preference = new mercadopago.Preference(client);
   let url = '';

<<<<<<< HEAD
    preference
      .create({
        body: {
          items: itemsProducts,
          payment_methods: {
              excluded_payment_methods: [],
              excluded_payment_types: [
              ],
              installments: 1
            },
          notification_url:'https://1ac5-187-249-108-43.ngrok-free.app/data-pago'
        }
      })
      .then(data =>{
          url = data.init_point
          return res.json({
              url_pago: url,
            });
      })
      .catch(console.log);
=======
   preference
     .create({
       body: {
         items: dataProductos,
         payment_methods: {
             excluded_payment_methods: [],
             excluded_payment_types: [
             ],
             installments: 1
           },
         notification_url:'https://0cfe-2806-10a6-14-a62d-3814-59ee-32d6-cd65.ngrok-free.app/data-pago'
       }
     })
     .then(data =>{
         url = data.init_point
         return res.json({
             url_pago: url,
           });
     })
     .catch(console.log);
>>>>>>> 102d2b57b8bc1ebdb485073a615d9a08470ed0a4
};

exports.saveCompra = async (req, res) =>{
    // console.log((await req.body.data));
    const client = new mercadopago.MercadoPagoConfig({
        accessToken:
          "TEST-705673372675327-042522-9021a1e87227a1621d73edc6ba52770c-1785204649",
      });
      // if(req.body.data !== undefined){
      //   const data = new mercadopago.Payment(client).capture(req.body.data)
      //   //console.log((await data));
      //   return res.json({
      //       message: 'Compra realizada'
      //   })
      // }
    res.json({
        message: 'Compra realizada'
    })
}
