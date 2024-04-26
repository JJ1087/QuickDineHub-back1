
const mercadopago = require("mercadopago");
const Product = require('../models/auth.modelMenu'); 
exports.getData = async (req, res) => {
  let dataProductos = [];
  for(let i = 0; i<req.body.productos.length; i++) {
    const products = await Product.findOne({_id:req.body.productos[i].id})
    dataProductos.push({
      id:products._id,
      title: products.nombre,
      quantity: req.body.productos[i].cantidad,
      unit_price: parseInt(products.precio),
    })
  }
  
  console.log(dataProductos)
  const client = new mercadopago.MercadoPagoConfig({
    accessToken:
      "TEST-1175297249318297-030816-e2ab1189bd638ddccd10514d28dab4cb-1719437028",
  });

  const preference = new mercadopago.Preference(client);
  let url = '';

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
         notification_url:'https://210c-187-249-108-43.ngrok-free.app/data-pago'
       }
     })
     .then(data =>{
         url = data.init_point
         return res.json({
             url_pago: url,
           });
     })
     .catch(console.log);
};

exports.saveCompra = async (req, res) =>{
    console.log((await req.body.data));
    const client = new mercadopago.MercadoPagoConfig({
        accessToken:
          "TEST-705673372675327-042522-9021a1e87227a1621d73edc6ba52770c-1785204649",
      });
      if(req.body.data !== undefined){
        const data = new mercadopago.Payment(client).capture(req.body.data)
        //console.log((await data));
        return res.json({
            message: 'Compra realizada'
        })
      }
    res.json({
        message: 'Compra realizada'
    })
}
