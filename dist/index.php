<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Cloud checkout</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/app.css">
    <script type="text/javascript">
      Param = {
          Reference : "<?=$_GET['r'];?>",
          ShopKey : "<?=$_GET['s'];?>",
      }
      
    </script>
  </head>
  <body>
    <!-- Header-->
    <header id="header">
      <div class="pull-right"><span href="#" data-model="order.currency"></span><span href="#" data-model="order.language"></span></div><img id="logo" src="img/picturedotcom_trans.png">
    </header>
    <!-- Main-->
    <div id="main" class="container">
      <!--Intro-->
      <div class="row">
        <!--Progress bar-->
        <section class="12u$ text-center">
          <ul class="actions">
            <li><a href="#">Product</a></li>
            <li><a href="#">Adress</a></li>
            <li><a href="#">Confirm</a></li>
            <li><a href="#">Payment</a></li>
          </ul>
        </section>
        <section data-template="address" class="6u template">
          <h2>Address</h2>
          <input type="hidden" data-js="address.id" data-model="address.id">
          <input type="hidden" data-js="address.type" data-model="address.type">
          <div class="row uniform"> 
            <div class="12u$">
              <input type="text" data-js="address.email" data-model="address.email" placeholder="Email">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.firstname" data-model="address.firstname" placeholder="Firstname">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.lastname" data-model="address.lastname" placeholder="Lastname">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.street1" data-model="address.street1" placeholder="street">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.zip" data-model="address.zip" placeholder="Zip">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.city" data-model="address.city" placeholder="City">
            </div>
            <div class="12u$">
              <input type="text" data-js="address.country" data-model="address.country" placeholder="Country">
            </div>
            <div>
              <input type="submit" data-js="address.submit" value="Save Address">
            </div>
          </div>
        </section>
        <section data-template="voucher" class="6u template">
          <h2>Add a voucher</h2>
          <div class="row uniform">
            <div class="9u 12u$(small)">
              <input type="text" data-js="voucher.value" placeholder="Voucher">
            </div>
            <div class="3u$ 12u$(small)">
              <input type="submit" data-js="voucher.submit" value="Add" class="fit">
            </div>
          </div>
        </section>
        <section data-template="confirm.order" class="6u template">
          <h2>Confirm Your order</h2>
          <table class="alt">
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                <td><span data-model="order.items_price"></span></td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td><span data-model="order.shipping_price"></span></td>
              </tr>
              <tr>
                <td>Fee</td>
                <td><span data-model="order.fee_price"></span></td>
              </tr>
              <tr>
                <td>Vat</td>
                <td><span data-model="order.vat_price"></span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td><span data-model="order.total_price"></span></td>
              </tr>
            </tfoot>
          </table>
        </section>
        <section data-template="confirm.address" class="6u template">
          <h2>Confirm Your address</h2>
          <dl>
            <dt>Firstname</dt>
            <dd><span data-model="address.firstname"></span></dd>
            <dt>Lastname</dt>
            <dd><span data-model="address.lastname"></span></dd>
            <dt>Street</dt>
            <dd><span data-model="address.street1"></span></dd>
            <dt>Zip</dt>
            <dd><span data-model="address.zip"></span></dd>
            <dt>City</dt>
            <dd><span data-model="address.city"></span></dd>
            <dt>Country</dt>
            <dd><span data-model="address.country"></span></dd>
          </dl>
        </section>
        <section data-template="product" class="6u template">
          <h2>Your product</h2>
          <div data-model="product">
            <input type="hidden" data-js="product.id" data-model="product.id">
            <input type="hidden" data-js="product.product_id" data-model="product.product_id">
            <ul>
              <li>Retail price total<span data-model="product.retail_price_total"></span></li>
              <li>Price<span data-model="product.price"></span></li>
              <li>locales_name<span data-model="product.locales_name"></span></li>
              <li>count<span data-model="product.count"></span></li>
              <li>user_price_total<span data-model="product.user_price_total"></span></li>
            </ul>
            <ul data-js="product.files"></ul>
            <div data-js="product.options"></div>
            <button data-js="product-inc">Increment</button><span data-model="product.count"></span>
            <button data-js="product-dec">Decrement</button>
          </div>
          <section class="12u$">
            <div class="row">
              <div class="4u"><a href="#">Choose more products</a></div>
              <div class="4u text-center">
                <button data-js="click-next">next</button>
              </div>
            </div>
          </section><a data-js="click-update" class="icon fa-phone">opdater</a>
        </section>
      </div>
    </div>
  </body>
  <!-- Scripts-->
  <script src="assets/jquery/jquery.js"></script>
  <script src="assets/baseline/skel.min.js"></script>
  <script src="assets/baseline/main.js"></script>
  <script src="assets/accounting.js/accounting.js"></script>
  <script src="js/app.js"></script>
</html>