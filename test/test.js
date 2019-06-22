var aggregate = {
    finalResponse : {
        Firstname : true,
        Lastname : false,
        Address : true,
        DOB : true,
        Image : false,
    },
    qaMetrics : {
        Firstname : 1,
        Lastname : 0,
        Address : 1,
        DOB : 1,
        Image : 0, 
    }
}
var response = []
var obj = aggregate.finalResponse
for (var key in obj) {
    // Image is not shown in phase one
    if (key === 'Image'){
        continue
    }
    if (obj.hasOwnProperty(key)) {
      response.push({Label:key,Result:obj[key],Confidence:aggregate.qaMetrics[key]})
    }
  }
  console.log(response)


var orders = [ { "name" : "chain", "description" : "necklace chain", "status": "shipped"} , {"name": "pen", "description" : "ball pen", "status": "shipped"}, {"name": "book", "description" : "travel diary", "status": "delivered"},{"name": "brush", "description" : "paint brush", "status": "delivered"}];
console.log(orders); 
var orderInfo = orders.map( function(order) {
 if( order.status === "delivered"){
     var info = { "orderName": order.name,
                  "orderDesc": order.description
                 }
     return info;
 }
});
console.log(orderInfo);