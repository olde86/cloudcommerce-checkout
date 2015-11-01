App =
  Api:
    host: 'https://Api.cloudprinter.com'
    namespace: '2.1'
  Config:
    shopKey: 'c71dd9ffa2885471889c1f8312fa4889'
    reference: 'WMb41446220613M4FpaPjwT07QXtaI-4a08d29f29565071cf1c5dc775cf3d2c'
    currency: 'USD'
    language: 'en_US'
  Send: (endpoint, data) ->
    $.ajax
      url: App.Api.host + '/' + App.Api.namespace + '/' + endpoint
      type: 'POST'
      data: JSON.stringify(data)
      dataType: 'json'
      success: (responce) ->
        console.log responce
        return
    return
  Init: ->
    data = 
      shopkey: App.Config.shopKey
      reference: App.Config.reference
      currency: App.Config.currency
      language: App.Config.language
    App.Send 'cart/info', data
    return
App.Init()
