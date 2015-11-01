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
    <header id="header"><a href="https://www.picture.com"> <img id="logo" src="img/picturedotcom_trans.png"></a>
      <nav><span href="#" data-model="order.currency"></span><span href="#" data-model="order.language"></span></nav>
    </header>
    <!-- Main-->
    <div id="content">
      <div id="main" class="container">
        <div class="row">
          <section class="12u$ text-center">
            <h1>Checkout</h1>
          </section>
        </div>
        <!--Intro-->
        <div class="boxed">
          <div class="row">
            <section data-template="address" class="6u">
              <div data-template="product.spinner" class="template">
                <h2>Ammount</h2>
                <div class="spinner"><span data-js="product-inc">+</span><span data-model="product.count" class="count"></span><span data-js="product-dec">-</span></div>
              </div>
              <div data-template="voucher" class="template">
                <h2>Add a voucher</h2>
                <div class="row uniform">
                  <div class="9u 12u$(small)">
                    <input type="text" data-js="voucher.value" placeholder="Voucher">
                  </div>
                  <div class="3u$ 12u$(small)">
                    <input type="submit" data-js="voucher.submit" value="Add" class="fit">
                  </div>
                </div>
              </div>
              <div data-template="address" class="template">
                <h2>Address</h2>
                <input type="hidden" data-js="address.id" data-model="address.id">
                <input type="hidden" data-js="address.type" data-model="address.type">
                <div class="row uniform"> 
                  <div class="12u$">
                    <input type="text" data-js="address.email" data-model="address.email" placeholder="Email">
                  </div>
                  <div class="6u">
                    <input type="text" data-js="address.firstname" data-model="address.firstname" placeholder="Firstname">
                  </div>
                  <div class="6u$">
                    <input type="text" data-js="address.lastname" data-model="address.lastname" placeholder="Lastname">
                  </div>
                  <div class="12u$">
                    <input type="text" data-js="address.street1" data-model="address.street1" placeholder="Street">
                  </div>
                  <div class="4u">
                    <input type="text" data-js="address.zip" data-model="address.zip" placeholder="Zip">
                  </div>
                  <div class="8u$">
                    <input type="text" data-js="address.city" data-model="address.city" placeholder="City">
                  </div>
                  <div class="12u$">
                    <input type="text" data-js="address.country" data-model="address.country" placeholder="Country">
                  </div>
                  <div>
                    <input type="submit" data-js="address.submit" value="Save Address">
                  </div>
                </div>
              </div>
              <div data-template="confirm.address" class="template">
                <h2>Confirm Your address</h2>
                <table class="alt">
                  <tbody>
                    <tr>
                      <td>Firstname</td>
                      <td><span data-model="address.firstname"></span></td>
                    </tr>
                    <tr>
                      <td>Lastname</td>
                      <td><span data-model="address.lastname"></span></td>
                    </tr>
                    <tr>
                      <td>Street</td>
                      <td><span data-model="address.street1"></span></td>
                    </tr>
                    <tr>
                      <td>Zip</td>
                      <td><span data-model="address.zip"></span></td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td><span data-model="address.city"></span></td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td><span data-model="address.country"></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section class="6u">
              <div data-template="product" class="template">
                <h2>Your product</h2>
                <ul data-js="product.files" class="images"></ul>
                <input type="hidden" data-js="product.id" data-model="product.id">
                <input type="hidden" data-js="product.product_id" data-model="product.product_id">
                <h2><span data-model="product.locales_name"></span></h2>
                <table class="alt">
                  <tbody>
                    <tr>
                      <td>Price pr. item</td>
                      <td><span data-model="product.retail_price_total"></span></td>
                    </tr>
                    <tr>
                      <td>Count</td>
                      <td><span data-model="product.count"></span></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td><strong data-model="product.user_price_total"></strong></td>
                    </tr>
                  </tfoot>
                </table>
                <h2>Options</h2>
                <table data-js="product.options" class="alt"></table>
              </div>
              <div data-template="confirm.order" class="template">
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
              </div>
            </section>
            <section class="12u$">
              <div data-template="product" class="template"><a href="#">Choose more products</a>
                <button data-js="click-next">next</button><a data-js="click-update" class="icon fa-phone">opdater</a>
              </div>
            </section>
          </div>
        </div>
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