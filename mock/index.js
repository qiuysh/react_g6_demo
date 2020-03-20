var Mock = require('mockjs');
var delay = require('mocker-api/utils/delay');
var noProxy = process.env.NO_PROXY === 'true';


var proxy = {
  'GET /api/v1/topo': function (req, res) {
      return res.send(Mock.mock({
        "data":{
          "edges|1-20":[
            {
              "id|+1": 0,
              "label":"@integer(0, 800) calls avg: @integer(0, 80)s",
              "source": "node-@integer(1, 8)",
              "target": "node-@integer(1, 8)",
            },
          ],
          "nodes|8":[
            {
              "i|+1": 1,
              "id|": function() {
                return 'node-'+this.i;
              },
              "label":function() {
                return '节点-'+this.i;
              },
            }
          ]
        },
        "result_code": 1,
        "result_message":"执行成功"
      })
    )
  },
}
module.exports = (noProxy ? {} : delay(proxy, 1000)); 