// Jquery extentions
$.template = function(el){
    return $('[data-template="' + el + '"]')
};

$.js = function(el){
    return $('[data-js="' + el + '"]')
};

$.model = function(el){
    return $('[data-model="' + el + '"]')
};

// Applicaiton
App = {

    Api: {
  
        Host: 'https://api.cloudprinter.com',
        Namespace: '2.1'

    },


    Config : {

        BaseUrl: 'https://www.cloudprinter.com',
        Namespace: '2.0',

        Payment : {
            Endpoint : "payment",
            
            Url : function () {
              return this.Config.BaseUrl + '/' + 
                     this.Config.Namespace + '/' + 
                     this.Config.Payment.Endpoint + '/' + 
                     this.Config.shopKey + '/' + 
                     this.Config.Reference;
            }

        },
    
        shopKey: Param.ShopKey,
        Reference: Param.Reference,

        Currency: 'USD',
        Language: 'en_US',
        Delivery: 'invoice_delivery'

    },

    Send : function (endpoint,data,handleData) {

        $.ajax({
          url: App.Api.Host + "/" + App.Api.Namespace + "/" + endpoint ,
          type: "POST",
          data: JSON.stringify(this.GetParams()),
          dataType: "json",
          success: function(data) {
            handleData(data);
          }
        });

        this.Params = null;

    },


    Init: function () {

        //Set visible tempaltes
        $.template('confirm.order').show();
        $.template('confirm.address').show();
        $.template('address').show();
        $.template('order').show();
        $.template('product').show();
        $.template('voucher').show();

        var data = App.Send('cart/info', this.GetParams(), function (data) {

            // Set default Addres type
            $.js('address.type').val(App.Config.Delivery);
            
            App.Seed(data);
          
        });
    },

    Seed: function (data) {

        if(data.id)
          Order.Populate(data);

        if(data.items)
        {
            $.each(data.items, function (key , item ){

                Product.Populate(item);

            });
        }

        if(data.addresses)
        {
            $.each(data.addresses, function (key , address ){

                Address.Populate(address);

            });
        }
    },


    // Getters and setters

    Params: null,

    GetParams: function () {
        if(this.Params == null)
        {
            this.Params = {
                shopkey:    this.Config.shopKey,
                reference:  this.Config.Reference,
                currency:   this.GetCurrency(),
                language:   this.GetLanguage()
            }
        }

        return this.Params;
    },

    SetParam: function (key,value) {
        if(this.Params == null)
          this.GetParams();

        this.Params[key] = value;
    },

    Language: null,
     
    GetLanguage: function () {
        if(this.Language == null)
            this.SetLanguage(this.Config.Language);

        return this.Language;
    },
     
    SetLanguage: function (data) {
        this.Language = data;
    },

    Currency: null,
     
    GetCurrency: function () {
        if(this.Currency == null)
            this.SetCurrency(this.Config.Currency);

        return this.Currency;
    },
     
    SetCurrency: function (data) {
        this.Currency = data;
    }

}

// Model

Model = {

    Set: function (value, data, callback, model) {

        // If the value is in the models pricearray then format the value
        if( $.inArray(value, model.prices) != -1 )
          data[value] = this.SetPriceAttribute(data[value]);

        var html = data[value];
       
        if(callback)
          callback();

        element = $.model(model.model + '.' + value);
        element.html(html);

        $.each(element, function () {

          if( $(this).is('input') )
            $(this).val(html);
          else
            $(this).html(html);

        });


    },

    SetPriceAttribute: function (data) {

      return Helper.Money(data) + ' ' + App.GetCurrency();

    },

}


// Product
Product = {

    model: 'product',

    prices: ['user_price_total','user_retail_total'],

    Set: function (value, data) { Model.Set(value, data, null, this); },
    
    Populate: function (data) {

        this.Options(data.options);

        this.Files(data.files);

        Product.Set('price',data);
        Product.Set('retail_price_total',data);
        Product.Set('id',data);
        Product.Set('product_id',data);
        Product.Set('locales_name',data);
        Product.Set('count',data);
        Product.Set('user_price_total',data);

        
    },

    Options : function (data) {

        $.js('product.options').html('');
      
        $.each(data, function (key , item ){
          $.js('product.options').append(
            '<ul>' +
            '<li>' + item.locales_name + '</li>' +
            '<li>' + item.count + '</li>' +
            '</ul>'
          );
        });

    },


    Files: function (data) {

        $.js('product.files').html('');

        $.each(data, function (key , item ){
          $.js('product.files').append('<li><img src="' + item.url + '"/></li>');
        });

    }

}

// Order
Order = {

    model: 'order',

    prices: ['items_price','total_price','shipping_price','fee_price','vat_price'],

    Set: function (value, data) { Model.Set(value,data, null, this); },

    Populate : function (data) {
        
        //App variables
        Order.Set('state',data);
        Order.Set('id',data);

        // Template variables
        Address.Set('email',data);
        Order.Set('language',data);
        Order.Set('currency',data);
        Order.Set('items_price',data);
        Order.Set('total_price',data);
        Order.Set('shipping_price',data);
        Order.Set('fee_price',data);
        Order.Set('vat_price',data);

    }

}

//Address
Address = {

    model: 'address',

    Set: function (value, data) { Model.Set(value,data, null, this); },

    Populate : function (data) {
        
        //App variables
        Address.Set('id',data);
        Address.Set('type',data);

        // Template variables
        Address.Set('firstname',data);
        Address.Set('lastname',data);
        Address.Set('street1',data);
        Address.Set('zip',data);
        Address.Set('city',data);
        Address.Set('country',data);

    }

}

Helper = {
    Money : function (data) {
     return accounting.formatNumber(( data / 10000),2);
    },

    Price: function (data)
    {
      return Helper.Money(data) + ' ' + App.GetCurrency();
    }
}

App.Init();


$(document).ready( function () {

  $.js('click-update').on('click', function () {
    App.Init();
  });


  $.js('product-inc').on('click', function () {

      var id = $.js('product.id').val();

      App.SetParam("item_id",id);

      var data = App.Send('cart/item/inc', App.GetParams(), function (data) {

          App.Seed(data);
        
      });
  })

  $.js('product-dec').on('click', function () {

      var id = $.js('product.id').val();

      App.SetParam("item_id",id);

      var data = App.Send('cart/item/dec', App.GetParams(), function (data) {

          App.Seed(data);
        
      });
  })

  $.js('voucher.submit').on('click', function () {

      var value = $.js('voucher.value').val();

      App.SetParam("voucher",value);

      var data = App.Send('cart/voucher/add', App.GetParams(), function (data) {

          App.Seed(data);
        
      });
  })

  $.js('address.submit').on('click', function () {

      App.SetParam("id",$.js('address.id').val());
      App.SetParam("type",$.js('address.type').val());
      App.SetParam("email",$.js('address.email').val());
      App.SetParam("firstname",$.js('address.firstname').val());
      App.SetParam("lastname",$.js('address.lastname').val());
      App.SetParam("street1",$.js('address.street1').val());
      App.SetParam("zip",$.js('address.zip').val());
      App.SetParam("city",$.js('address.city').val());
      App.SetParam("country",$.js('address.country').val());
      App.SetParam("company",'');
      
      console.log(App.GetParams());

      var data = App.Send('cart/address/add', App.GetParams(), function (data) {
          App.Seed(data);
      });
  })


});

