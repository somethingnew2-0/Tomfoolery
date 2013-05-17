var products = {45:["prod_surround_sound", "prod_monitor", "prod_smartphone", "prod_gps_navigator", "prod_digital_camera", "prod_graphingcalculator", "prod_webcam", "prod_waterproof_watch", "prod_ear_buds", "prod_rechargeable_batteries"],
                827:["prod_shotgun","prod_golf_driver","prod_gnar_snowboard","prod_binoculars","prod_paintball_gun","prod_ballnmitt","prod_dumbbell_set","prod_basketball","prod_sport_sunglasses","prod_pong_balls"],
                1018:["prod_kobe_beef","prod_maine_lobster","prod_crablegs","prod_cheesecake","prod_shark_fillet","prod_spanish_ham","prod_sushi","prod_deep_dish_pizza","prod_string_cheese"],
                3529:["prod_labrador_puppy","prod_chatreux_kitten.png","prod_piranha","prod_turtle","prod_bunny","prod_corn_snake","prod_parakeet.png","prod_hamster","prod_dogtreats","prod_betta_fish","prod_fish_food"],
				16867:["prod_douro_wine","prod_wine_chiller","prod_bluecheese","prod_aged_cheese","prod_french_champagne","prod_cheese_set","prod_local_pinot_noir","prod_box_of_wine","prod_bottle_opener"],
				16870:["prod_diamond_engagement_ring","prod_10k_gold_ring","prod_pearl_necklace","prod_righthand_ring","prod_emerald_necklace","prod_ruby_earrings","prod_amethyst_ring","prod_pink_sapphire_earrings","prod_charm_bracelet","prod_hoop_earrings"],
				16960:["prod_robot_vacuum","prod_dining_set","prod_persian_rug","prod_foot_massager","prod_crystal_vase","prod_table_lamp","prod_welcome_mat"],
				16977:["prod_evening_dress","prod_designer_jeans","prod_designer_bag","prod_leather_jacket","prod_high_heels","prod_lingerie","prod_sundress","prod_designer_sunglasses","prod_tank_top","prod_flip_flops"]}
var productIds = [4040,45963,5560,5008,6582,46362,45967,46373,46715,46653,47446,47067,47539,47080,47447,47171];
function hack() {
  $.ajax({
    type: 'POST',
    url: "http://topfounder.perblue.com/Default.aspx/CollectAllRevenue",
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    processData: true,
    async: false,
    success: function(data) {
        var obj = eval(data);
        if(!obj.d.error) {
          var timeUntilNext = (eval(obj.d.data.next_collection).getTime() - new Date().getTime()) + 1000;
          console.log("Next Collect Revenue: "+timeUntilNext);
          setTimeout(hack, timeUntilNext)
        } else {
	      console.log("Try Next Collect Revenue: "+30*1000);
          setTimeout(hack, 30*1000);
        }
    }
  });
  var outOfCash = false;
  for(productIdx in productIds) {
    var productId = productIds[productIdx];
    if(outOfCash) {
      break;
    }
    $.ajax({
      type: 'POST',
      url: "http://topfounder.perblue.com/RunMarketing.aspx/Run",
      data: '{"productId":"'+productId+'","marketingKey":"marketing_flyers"}',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      processData: true,
      async: false,
      success: function(data) {
        var obj = eval(data);
        console.log("Advertise: " + productId);
        if (obj.d.error == 'not_enough_cash') {
          outOfCash = true;
          return;
        }
      }
    });
  }
  for(storeId in products) {
    var productList = products[storeId];
    if(outOfCash) {
      break;
    }
    for(productIdx in productList) {
      var product = productList[productIdx];
      if (outOfCash) {
          break;
      }
      var last = true;
      var keepTrying = true;
      var units = 0;
      $.ajax({
        type: 'POST',
        url: "http://topfounder.perblue.com/Stores.aspx/PurchaseProductFast",
        data: '{"amount":"1","productKey":"'+product+'","storeID":"'+storeId+'"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        processData: true,
        async: false,
        success: function(data) {
          var obj = eval(data);
          if (obj.d.result == 'error' && obj.d.message == 'not_enough_cash') {
            outOfCash = true;
            return;
          }
          if (obj.d.result == 'error' && obj.d.message == 'insufficient_inventory') {
            keepTrying = false;
            return;
          }
          if (obj.d.result == 'error' || obj.d.message == 'success') {
            keepTrying = false;
            console.log(obj.d);
            return;
          }
          units = obj.d.new_units;
        }
      });
      while(keepTrying && !outOfCash && last) {
        if(parseInt(productIdx) + 1 < productList.length) {
          last = false;
          if(units>1400) {
            break;
          }
        }
        console.log("Buy: "+product);
        $.ajax({
          type: 'POST',
          url: "http://topfounder.perblue.com/Stores.aspx/PurchaseProductFast",
          data: '{"amount":"1500","productKey":"'+product+'","storeID":"'+storeId+'"}',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          processData: true,
          async: false,
          success: function(data) {
            var obj = eval(data);
            if (obj.d.result == 'error' && obj.d.message == 'not_enough_cash') {
              outOfCash = true;
              return;
            }
            if (obj.d.result == 'error' && obj.d.message == 'insufficient_inventory') {
              keepTrying = false;
              return;
            }

            if (obj.d.result == 'error' || obj.d.message == 'success') {
              keepTrying = false;
              console.log(obj.d);
              return;
            }
            units = obj.d.new_units;
          }
        });
      }
    }
  }
}
hack();
window.onbeforeunload = function() {
        return "Dude, are you sure you want to leave? Think of the kittens!";
}
TF.UI.fetchData = function() {
  /*$.ajax({
	url: 'Default.aspx/DataPing',
	type: 'POST',
	dataType: 'json',
	contentType: 'application/json; charset=utf-8',
	data: '{}',
	timeout: 15000,
	error: function() {
	},
	success: TF.UI.processFetchData
  });*/
};
