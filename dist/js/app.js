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

// Model

Model = {

    Set: function (value, data, callback, model) {

        var html = data[value];
       
        callback();

        console.log(data.total_price);

        $.model( model + '.' + value ).html(html);

    }

}


// Product
Product = {

    model: 'product',

    Set: function (value, data) {

        if(value == "locales_name")         
          this.SetLocalesNameAttribute(data[value]);

        Model.Set(value,data,function() {

        }, this.model);
    },
    
    SetLocalesNameAttribute: function (data) {

        $.js('product.image').attr('alt', data);

    }

}

// Order
Order = {

    model: 'order',

    Set: function (value, data) {

        if(value == "total_price")         
          data.total_price = this.SetTotalPriceAttribute(data[value])

        Model.Set(value,data,function() {

        }, this.model);
    },

    SetTotalPriceAttribute: function (data) {

      return Helper.Money(data);

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

