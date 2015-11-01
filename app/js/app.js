// Jquery extentions
$.js = function(el){
    return $('[data-js="' + el + '"]')
};

$.model = function(el){
    return $('[data-model="' + el + '"]')
};

// Applicaiton
App = {

    Api: {
  
        host: 'https://Api.cloudprinter.com',
        namespace: '2.1'

    },


    Config : {
    
        shopKey: 'c71dd9ffa2885471889c1f8312fa4889',
        reference: 'WMb41446220613M4FpaPjwT07QXtaI-4a08d29f29565071cf1c5dc775cf3d2c',
        currency: 'USD',
        language: 'en_US'

    },

    Send : function (endpoint,data,handleData) {

        $.ajax({
          url: App.Api.host + "/" + App.Api.namespace + "/" + endpoint ,
          type: "POST",
          data: JSON.stringify(data),
          dataType: "json",
          success: function(data) {
            handleData(data);
          }
        });

    },


    Init: function () {

        var data = {
            shopkey:    App.Config.shopKey,
            reference:  App.Config.reference,
            currency:   App.Config.currency,
            language:   App.Config.language
        }

        var data = App.Send('cart/info', data, function (data) {

            $.model('order.currency').html(data.currency);


            Order.Set('currency',data);
            Order.Set('total_price',data);


            $.each(data.items, function (key , item ){

                Product.Set('locales_name',item);

                $.model('product.title').html(item.locales_name);
                $.model('product.count').html(item.count);
                //Order.Set('count',data);
            });
          
        });
    }

}

Product = {

    model: 'product',

    Set: function (value,dataSet) {

        var data = dataSet[value];
       
        //Also set product image alt text 
        if(value == "locales_name")         
          $.js('product.image').attr('rel', data);

        console.log($.js('product.image').attr('rel'));

        $.model(Product.model + '.' + value ).html(data);

    }

}

Order = {

    model: 'order',

    Set: function (value,dataSet) {

        var data = dataSet[value];
        
        if(value == "total_price")         
          data = Helper.Money(data);

        console.log(data);

        $.model(Order.model + '.' + value ).html(data);


    }

}

Helper = {
    Money : function (data) {
     return accounting.formatNumber(( data / 10000),2);
    }
}



App.Init();


$(document).ready( function () {

  $.js('click-update').on('click', function () {
    console.log('update');
    App.Init();
  });


  $.js('product-inc').on('click', function () {

      var id = $(this).attr('rel');

      var param = {
          shopkey:    App.Config.shopKey,
          reference:  App.Config.reference,
          currency:   App.Config.currency,
          language:   App.Config.language,
          item_id:    id
      }

      var data = App.Send('cart/item/inc', param, function (data) {

            Order.Set('total_price',data);

            $.each(data.items, function (key , item ){
                $.model('product.count').html(item.count);
            });
        
      });
  })

  $.js('product-dec').on('click', function () {

      var id = $(this).attr('rel');

      var param = {
          shopkey:    App.Config.shopKey,
          reference:  App.Config.reference,
          currency:   App.Config.currency,
          language:   App.Config.language,
          item_id:    id
      }

      var data = App.Send('cart/item/dec', param, function (data) {

            Order.Set('total_price',data);

            $.each(data.items, function (key , item ){
                $.model('product.count').html(item.count);
            });
        
      });
  })

});

