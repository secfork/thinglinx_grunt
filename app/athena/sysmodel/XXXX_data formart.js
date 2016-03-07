{
  "uuid":"0891d080-02b8-11e5-92a2-a301e9b19921",   //采集器ID
  "name":"demo_system_1", "desc":null,
  "model":"085d2bf0-02b8-11e5-92a2-a301e9b19921",
  "profile":"0862aa30-02b8-11e5-92a2-a301e9b19921",
  "state":0,                                       //采集器状态 激活 未激活 挂起
  "comm_type":0,
  "network":     //采集器与中心网络连接参数
  {
    "network_type":"gprs",                                   //采集器与中心网络连接类型
    "network_param":{"dtu":"HongDian","simid":"18210032000"} //采集器与中心网络连接参数
   },

  "account_id":1,"daserver_id":null,
  "sn":"DEMOSMABC123",
  "longitude":null,"latitude":null,
  "pos_type":0,"version":0,
  "create_time":"2015-05-25T08:28:34.000Z",
  "last_modify_time":"2015-05-25T08:28:34.000Z",
  "last_sync_time":"0000-00-00 00:00:00",
 
  "tags":                                                    //数据库点列表
  [
    {
      "id":1,"name":"tag_1","desc":null,"type":"Number","group":null, //type点类型 
      "connect":"device_1.point_1"     // dev名( 非devModelming). devModelpoint名;                                //点对应的通讯连接项
    },        
    {
      "id":2,"name":"tag_2","desc":null,"type":"String","group":null,
      "connect":"device_1.point_2"
    },        
   {
      "id":3,"name":"tag_3","desc":null,"type":"Object","group":null,
      "connect":"device_1.point_3"
    }
  ],

  "devices":                                                //采集器设备列表
  [
    {
      "id":1,"name":"device_1","desc":null,
      "device_model":"087fcf20-02b8-11e5-92a2-a301e9b19921",
      "params":                        //设备协议相关参数配置
              {
                "crc_order": "0",
                "protocol": "0",
                "float_order": "0",
                "address": "1",
                "double_order": "0",
                "int_order": "0"
              },                                        
      "network":                        //设备网络相关参数配置
              {
                  "network_type":"tcpclient",                   //设备网络类型 rs232 rs485 tcpclient tcpserver  
                  "network_param":{"ip":"172.18.15.71","port":"512"} //设备网络参数
              },                                      
      
      "extends":
     {
       "uuid":"087fcf20-02b8-11e5-92a2-a301e9b19921",
       "name":"demo_device_model_1","desc":null,
       "driver_id":"FCS_MODBUS",       //设备驱动ID  
       "driver_ver":"1.0.0.0", 
       "point_count":3,
      
       "points":                       //设备点配置参数
       [
        {
          "id":1,"name":"point_1","desc":null,       // "type":"float","readwrite":0,  //type和readwrite暂时不用
         
           "params":                    //协议相关点配置参数  
                  {
                    "area": "3",        //寄存器区 0 DO区, 1 DI区,2 AR区,3 HR区             
                    "address": "0",     //寄存器地址 从0开始
                    "data_type": "4",   //数据类型 0 bool,1 char,2 byte,3 short,4 unsigned short,5 int,6 unsigned int,7 float,8 double,9 16位BCD码，10 32位BCD码
                    "data_type_ex": "0",//按位读取位偏移
                    "access_right": "0" //数据读写权限 0 只读，1 只写，2 读写
                  }
        },
        {
          "id":2,"name":"point_2","desc":null,"type":"double","readwrite":0,
          "params":
                  {
                   "area": "3",
                   "address": "0",
                   "data_type": "4",
                   "data_type_ex": "0",
                   "access_right": "0"
                   }
        },
        {
          "id":3,"name":"point_3","desc":null,"type":"boolean","readwrite":0,
          "params":
                  {
                    "area": "3",
                    "address": "0",
                    "data_type": "4",
                    "data_type_ex": "0",
                    "access_right": "0"
                   }
        }
       ]
      }
    }
  ]

}