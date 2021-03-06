Helper = {
    Money : function (data) {
     return accounting.formatNumber(( data / 10000),2);
    },

    Price: function (data)
    {
      return Helper.Money(data) + ' ' + App.GetCurrency();
    },

    Get: function (name) {

      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

          results = regex.exec(location.search);

      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    }
}

Param.authResult = Helper.Get('authResult');

var lang = {
  en_US : {
    Payment: {
      Responce: {
        AUTHORISED: "Thank you for your Picture.com order.",
        REFUSED: "We are unable to process your payment. Please confirm the payment information was entered correctly or try another form of payment.",
        CANCELLED: "Cancelled",
        PENDING: "Your payment is pending approval. Thank you for your patience.",
        ERROR: "An error occurred while processing your payment.",
      }
    }
  }
}

// Jquery extentions
$.error = function(el){
    return $('[data-error="' + el + '"]')
};

$.template = function(el){
    return $('[data-template="' + el + '"]')
};

$.view = function(el){
    return $('[data-view="' + el + '"]')
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
        Namespace: Param.Namespace

    },


    Config : {

        HomeUrl: 'http://www.picture.com',
        BaseUrl: 'https://www.cloudprinter.com',
        Namespace: Param.Namespace,

        Payment : {
            Endpoint : "payment",
            
            Url : function () {
              return App.Config.BaseUrl + '/' + 
                     App.Config.Namespace + '/' + 
                     App.Config.Payment.Endpoint + '/' + 
                     App.Config.shopKey + '/' + 
                     App.Config.Reference;
            }

        },
    
        shopKey: Param.ShopKey,
        Reference: Param.Reference,

        Currency: 'USD',
        Language: 'en_US',
        Delivery: 'invoice_delivery'

    },

    Send : function (endpoint,data,handleData) {

        // Clear error message
        App.HideError();

        $.ajax({
          url: App.Api.Host + "/" + App.Api.Namespace + "/" + endpoint ,
          type: "POST",
          data: JSON.stringify(this.GetParams()),
          dataType: "json",
          success: function(data,statusText,xhr) {
            handleData(data,statusText,xhr);
          }
        });

        this.Params = null;

    },


    Init: function () {

        $.js('HomeUrl').attr('href', App.Config.HomeUrl);

        var data = App.Send('cart/info', this.GetParams(), function (data, statusText, xhr) {

            // Set default Addres type
            $.js('address.type').val(App.Config.Delivery);
            
            App.Seed(data);
            App.SetState(data.state);


            if(Param.authResult == "REFUSED")
            {
              App.View.Confirm();
              App.ShowError(lang[App.Config.Language].Payment.Responce.REFUSED)
            }
            else if(Param.authResult == "AUTHORISED")
            {
              App.View.Success();
              $.js('success-text').html(lang[App.Config.Language].Payment.Responce.AUTHORISED);
            }
            else if(Param.authResult == "CANCELLED")
            {
              App.View.Confirm();
            }
            else if(Param.authResult == "PENDING")
            {
              App.View.Success();
              $.js('success-text').html(lang[App.Config.Language].Payment.Responce.PENDING)
            }
            else if(Param.authResult == "ERROR")
            {
              App.View.Confirm();
              App.ShowError(lang[App.Config.Language].Payment.Responce.ERROR, 'top')
            }
            else if( App.State == 1 )
            {
              App.View.Product(data);
            }
            else if( App.State == 2 ) 
            {
              App.View.Success();
            }
            else
            {
              App.View.NotFound();
            }

        });

        var data = App.Send('cart/countries', this.GetParams(), function (data, statusText, xhr) {
          
          $.each(data, function (key, value) {
              $.js('address.country').append('<option value="' + value.name + '">' + value.note+ '</option>');
          });

          if($.js('address.country').children('option[selected="selected"]').val() === undefined)
            $.js('address.country').children('option[value="US"]').attr('selected','selected');
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

    View: {

        Current: null,

        Reset: function () {
            $('.template').hide();
            App.HideError();
            $('.steps li').removeClass('selected')
            $('.steps li').removeClass('selected')
        },

        Test: function (view) {

            App.View.Reset();
           
            if(view == 'Product')
            {
                if(App.State == 1)
                  return true;
            }
            else if(view == 'Address')
            {
                if(App.State == 1)
                  return true;
            }
            else if(view == 'Confirm')
            {
                if(App.State == 1 &&
                    $.js('address.email').val() != "" &&
                    $.js('address.firstname').val() != "" &&
                    $.js('address.lastname').val() != "" &&
                    $.js('address.street1').val() != "" &&
                    $.js('address.zip').val() != "" &&
                    $.js('address.city').val() != "" &&
                    $.js('address.country').val() != "")
                  return true;
              
            }
            else if(view == 'Success')
            {
                if(Param.authResult == 'AUTHORISED' )
                  return true;
                else if(Param.authResult == 'PENDING' )
                  return true;
                else if(App.State == 2)
                  return true;
            }
            
            return false;

        },

        Product: function (data) {
            data = data || false;
            if(App.View.Test('Product'))
            {
                App.View.Current = "Product";
                $.view('Product').addClass('selected');
                $.template('product.spinner').show();
                $.template('product.image').show();
                $.template('product.details').show();
                $.template('product.options').show();
                $.template('action-next').show();
               
                if(data && data.voucher)
                    Order.HasVoucher = true;

                if(Order.HasVoucher)
                  $.template('voucher.list').show();
                else
                  $.template('voucher.add').show();
            }
            else
            {
                App.View.NotFound();
            }

        },
        
        Address: function () {
            if(App.View.Test('Address'))
            {
                App.View.Current = "Address";
                $.view('Address').addClass('selected');
                $.template('address').show();
                $.template('product.details').show();
                $.template('product.options').show();
                $.template('action-back').show();
                $.template('action-next').show();
            }
            else
            {
                App.View.Product();
            }


        },

        Confirm: function () {
            if(App.View.Test('Confirm'))
            {
                App.View.Current = "Confirm";
                $.view('Confirm').addClass('selected');
                $.template('product.image').show();
                $.template('confirm.order').show();
                $.template('confirm.address').show();
                $.template('action-back').show();
                $.template('action-next').show();
            }
            else
            {
                App.View.Address();
            }


        },

        Success: function () {
            if(App.View.Test('Success'))
            {
                App.View.Current = "Success";
                $.view('Success').addClass('selected');
                $.template('success').show();
                $.template('action-home').show();
            }
            else
            {
                App.View.Product();
            }
        },
        
        NotFound : function () {
            App.View.Current = "NotFound";
            $.template('404').show();
        }
    },


    // Getters and setters

    State: null,

    GetState: function ()
    {
        return this.State;
    },

    SetState: function (value) {
        this.State = value;
    },

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
    },

    ShowError: function (data, pos) {
        pos = pos || false;

        if(pos == false)
          $.error('bottom').html('<p>' + data + '</p>').show();
        else
          $.error(pos).html('<p>' + data + '</p>').show();

    },

    HideError: function () {
        $.error('top').html('').hide();
        $.error('bottom').html('').hide();
    }

}

// Model

Model = {

    Set: function (value, data, callback, model) {

        // If the value is in the models pricearray then format the value
        if( $.inArray(value, model.prices) != -1 )
          data[value] = this.SetPriceAttribute(data[value]);

        // If the value is false, set it to an empty string

        if(data[value] == false)
          data[value] = "";

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

    prices: ['user_price_total','retail_price_total'],

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
            '<tr>' +
            '<td>' + item.locales_name + '</td>' +
            '<td>' + item.count + '</td>' +
            '</tr>'
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

    prices: ['items_price','total_price','shipping_price','fee_price','vat_price','total_discount'],

    HasVoucher : null,

    Set: function (value, data) {

      if(value == 'total_discount' && data[value] == false)
        $.js('toggle.discount').hide();
      else
        $.js('toggle.discount').show();

      Model.Set(value,data, null, this);
    },

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
        //Order.Set('fee_price',data);
        Order.Set('vat_price',data);
        Order.Set('total_discount',data);
        Order.Set('voucher',data);

    }

}

//Address
Address = {

    model: 'address',

    Set: function (value, data) {

      if(value == 'country' && data[value])
      {
        $.js('address.country').children('option[selected="selected"]').removeAttr('selected');
        $.js('address.country').children('option[value="' + data[value] + '"]').attr('selected','selected');
      }
    
      Model.Set(value,data, null, this);

    },

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

    },

    ValidateForm: function() {
        if($.js('address.email').val() != "" &&
        $.js('address.firstname').val() != "" &&
        $.js('address.lastname').val() != "" &&
        $.js('address.street1').val() != "" &&
        $.js('address.zip').val() != "" &&
        $.js('address.city').val() != "" &&
        $.js('address.country').val() != "")
        {
            return true;
        }
        else
        {
            return false
        }
    }

    

}

App.Init();


$(document).ready( function () {

  $.js('click-back').on('click', function () {

      if(App.View.Current == 'Address')
      {
          App.View.Product();
      }
      else if(App.View.Current == 'Confirm')
      {
          App.View.Address();
      }
  });

  $.js('click-next').on('click', function (e) {
      e.preventDefault();

      if(App.View.Current == 'Product')
      {
          App.View.Address();
      }
      else if(App.View.Current == 'Address')
      {


          if(Address.ValidateForm() == false)
          {
              App.ShowError("Please complete the address fields before continuing.");
              return;
          }


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

          var data = App.Send('cart/address/add', App.GetParams(), function (data,statusText,xhr) {

              if(xhr.status == 200)
              {
                App.Seed(data);
                App.View.Confirm();
              }
              else
              {
                  App.ShowError("Something went wrong while trying to save your address.");
              }
                
          });
      }
      else if(App.View.Current == 'Confirm')
      {

        window.location.href = App.Config.Payment.Url();
        
      }

  });

  $.js('click-home').on('click', function () {
      if(App.View.Current == 'Success')
      {
          window.location.href = App.Config.HomeUrl;
      }
  });

  $.js('product-inc').on('click', function () {

      var id = $.js('product.id').val();

      App.SetParam("item_id",id);

      var data = App.Send('cart/item/inc', App.GetParams(), function (data,statusText,xhr) {

          App.Seed(data);
        
      });
  })

  $.js('product-dec').on('click', function () {

      var id = $.js('product.id').val();

      App.SetParam("item_id",id);

      var data = App.Send('cart/item/dec', App.GetParams(), function (data, statusText, xhr) {

          App.Seed(data);
        
      });
  })

  $.js('voucher.submit').on('click', function () {

      var value = $.js('voucher.value').val();

      App.SetParam("voucher",value);

      var data = App.Send('cart/voucher/add', App.GetParams(), function (data,statusText,xhr) {

          if(xhr.status == 200)
          {
              App.Seed(data);

              $.js('voucher.value').val();
              $.template('voucher.add').hide();
              $.template('voucher.list').show();
          }
          else
          {
              App.ShowError("We do not recognize the coupon code you entered. Please ensure it is entered correctly.");
          }
        
      });
  })

});

