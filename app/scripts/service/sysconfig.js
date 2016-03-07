 

angular.module('app.sysconfig', [], function() {})

.service("$sys", function($translate) {

    return {

        // systemo 模式: manage , unmanage ,unknown ; 
        manageMode: 1,

        itemsPerPage: 20,


        state_inter_time: 60000, // system 在线状态更新 周期; 


        yesOrNo: [{
            k: "是",
            v: 1
        }, {
            k: "否",
            v: 0
        }],

        sysState: {
            '激活': 1,
            "未激活": [0, 2]
        },

        permissionDesc: {
            "READ_DATA": "读取系统变量的数据",
            "WRITE_DATA": "将数据写入系统变量中",
            "ALARM_VIEW": "查看系统产生的报警",
            "ACK_ALARM": "确认系统产生的报警",
            "SYSTEM_MANAGE": "创建、删除系统，修改系统基本信息",
            "TICKET_MANAGE": "创建及删除系统的ticket",
            "REGION_USER_MANAGE": "为区域创建用户，以及管理用户权限",
            "SYN_CONFIG": "将系统工程同步到DAServer或网关",
            "SYSTEM_CONTROL": "系统数据下置及召唤，系统的激活及失效，切换系统配置项，保存网络参数等",


            "REGION_MANAGE": "创建、删除区域，修改区域基本信息",
            "MODEL_MANAGE": "创建、修改以及删除系统模型和设备模型",
            "USER_MANAGE": "创建、删除用户，修改用户基本信息以及管理用户权限",
            "ROLE_MANAGE": "创建、修改以及删除角色"

        },

        // 账户权限; 
        accountP: [
            "REGION_MANAGE", // 区域管理
            "MODEL_MANAGE", //模型管理
            // "GROUP_MANAGE", //用户组管理
            "USER_MANAGE", //用户管理
            "ROLE_MANAGE", //角色管理
        ],



        // 区域权限; 
        regionP: [

            "READ_DATA", //读数据
            "WRITE_DATA", //写数据
            "ALARM_VIEW", //报警查看
            "ACK_ALARM", //报警确认
            "SYSTEM_MANAGE", //系统管理
            "TICKET_MANAGE", //ticket管理
            "REGION_USER_MANAGE", //区域用户管理
            "SYN_CONFIG", //系统配置 
            "SYSTEM_CONTROL" //系统控制
        ],


        // 角色类型; 
        roleType: {
            '账户角色': 0,
            "区域角色": 1
        },


        // application  首页;
        rootState: "app.m_region",
        // 分页数据; 

        // 报警类型;
        alarmtype: {
            defalut: 0,
            values: [{
                    k: "越限值报警 > ",
                    v: 0
                }, {
                    k: "越限值报警 >= ",
                    v: 1
                }, {
                    k: "越限值报警 <",
                    v: 2
                }, {
                    k: "越限值报警 <=",
                    v: 3
                },

                {
                    k: "变化报警  = ",
                    v: 4
                }, {
                    k: "变化报警 !=",
                    v: 5
                },

                /*{k:"位报警 &&"     , v:6 } ,
                {k:"位报警 ||"     , v:7 } ,
                {k:"位报警 xor"    , v:8 } ,
                {k:"位报警 not &&" , v:9 } ,
                {k:"位报警 not || "   , v:10 } ,
                {k:"位报警 not xor"  , v:11 }*/

                {
                    k: "位报警 按位与",
                    v: 6
                }, {
                    k: "位报警 按位或",
                    v: 7
                }, {
                    k: "位报警 按位异或",
                    v: 8
                }, {
                    k: "位报警 按位与 取反",
                    v: 9
                }, {
                    k: "位报警 按位或 取反 ",
                    v: 10
                }, {
                    k: "位报警 按位异或 取反",
                    v: 11
                }

            ]
        },


        // 报警源  alarmorigin
        trigger: {
            origin_default: '0',
            origin: {
                0: "ThingLinx Cloud",
                //                jjw 去掉Remote Gateway
                //                1: "Remote Gateway"
            },

            action_default: 'alarm',
            action: {
                'alarm': "Alarm",
                //"event": "Event",
                //'task': "Task"
            },
            // 1:"事件" , 2:"任务"} , 

            action_alarm: "alarm",
            action_event: "event",
            action_task: "task",

            type_default: '1',
            type: {
                0: "状态持续触发",
                1: "状态变化触发"
            },

            // {"PV":"PV" ,null:"输入值"},  
            // fn 限制不可为 字符串的 "null" 故 改成 array 形式; 
            fn_default: "PV",
            fn: {
                "PV": "PV"
            },


            op_default: ">",
            op: [">", "<", "==", ">=", "<=", "!=", "&", "|", "xor"],


            // op:[ ">" , "<" , "=" ,">=" , "<=" ,"!=" , "&" ,"|" ,"!" ,"~"],

            verb_default: 'and',
            verb: ['and', 'or'],


            severity_default: "0",
            severity: {
                '0': '不确定的', //'Indeterminate',
                '1': '紧急的', //'Critical ',
                '2': '重要的', //'Major ',
                '3': '一般的', //'Minor ',
                '4': '警告', //'Warning',
                // '5':'Cleared'
            },

            class_id_default: "1",
            class_id: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], // 类型;        

            desc: ""
        },

        // 新建 trigger 时 conditons [] 中 的值 使用该模版; 
        trigger_c: { //verb : null,
            exp: {
                left: {
                    fn: 'PV',
                    args: null
                }, //   fn: pv  || null ; 
                op: ">=",
                right: {
                    fn: 'PV',
                    args: null
                }
            }
        },

        sysManageMode: 1,
        sysModelMode: {
            default: "1",
            values: {
                // "1": "Managed",
                // "2": "UnManaged"
                // 
                "1": "托管模式",
                "2": "非托管模式"
            }
        },

        save_his: {
            desc: " prof pint 是否保存历史!",
            default: 0,
            values: [{
                v: 0,
                k: "不保存历史"
            }, {
                v: 1,
                k: "保存历史"
            }]
        },

        log_period: {
            desc: " prof pint 的 日志周期!",
            //            jjw
            default: 300,
            values: [{
                v: '60',
                k: "1分钟"
            }, {
                v: '300',
                k: "5分钟"
            }, {
                v: '600',
                k: "10分钟"
            }, {
                v: '900',
                k: "15分钟"
            }, {
                v: '1800',
                k: "30分钟"
            }, {
                v: '3600',
                k: "60分钟"
            }]
        },
        log_type: {
            //            jjw
            default: "",
            values: {
                //                "RAW": "保存原始记录",
                //                "CHANGED": "只在变化时存储"
                //                jjw
                "RAW": "周期保存",
                "CHANGED": "变化时保存"


            }
        },

        // 添加 device 时 根据类型 加载;
        device_type: [],

        // 添加 device   moudbus  0 时 配置 数据;  以后版本要更新; ;
        //"device_modbus_" : {  // 根据version 配置; 

        "device": {
            entity: {
                dev_cycle: 1,
                cycle_unit: 1,
                slow_cycle: 1,
                slow_cycle_unit: 2,
                dev_timeout: 15,
                dev_retry: 1,
                delay: 1,
            },

            // 时间单位; 
            timeUnit: [{
                k: "Second",
                v: 0
            }, {
                k: "Minute",
                v: 1
            }, {
                k: "Hour",
                v: 2
            }],
            
            "PI_SHCYA": {
                entity: {
                    params: {
                        link_address: 2
                    }
                }
            },

            // device emodel 的 驱动Id ;  
            "FCS_MODBUS": {
                // 公共部分默认值 ; 
                entity: {
                    params: { // 驱动部分默认值; 
                        address: 1,
                        protocol_type: 0,
                        offset_format: 0,
                        // register_length :1 ,
                        max_packet_length: 64,
                        packet_offset: 4,
                        int_order: 0,
                        int64_order: 0,
                        float_order: 0,
                        double_order: 0,
                        // register_order : 0 ,
                        crc_order: 0
                    }
                },

                // device model 驱动 版本号 ;  // {k:"" , v: } ,

                protocol: [{
                    k: "ModbusRtu",
                    v: 0
                }, {
                    k: "ModbusTcp",
                    v: 1
                }],

                offsetformat: [{
                    k: "10进制",
                    v: 0
                }, {
                    k: "Modbus格式",
                    v: 1
                }],

                reglength: [{
                    k: "1 字节",
                    v: 0
                }, {
                    k: "2 字节",
                    v: 1
                }, {
                    k: "4 字节",
                    v: 2
                }],

                order_a: [{
                    k: "FFH4_FFH3_FFH2_FFH1",
                    v: 0
                }, {
                    k: "FFH3_FFH4_FFH1_FFH2",
                    v: 1
                }, {
                    k: "FFH1_FFH2_FFH3_FFH4",
                    v: 2
                }, {
                    k: "FFH2_FFH1_FFH4_FFH3",
                    v: 3
                }],

                order_b: [{
                    k: "正序",
                    v: 0
                }, {
                    k: "逆序",
                    v: 1
                }],

                order_c: [{
                    k: "高前低后",
                    v: 0
                }, {
                    k: "低前高后",
                    v: 1
                }]

            },

            "PLC_SIEMENS_PPI": {
                entity: {
                    params: {
                        address: 1,
                        max_packet_length: 150,
                        packet_offset: 10
                    }
                }
            }





        },

        // tip 分类;  profPoint-tip ;

        // template 点创建;  template point type ;  0 = modbus ;



        "point": {
            // 公共部分默认值;   
            entity: {
                poll: 0,
                is_packet: 0,

            },

            // 点轮询 ; 
            pointPoll: [{
                k: "Normal",
                v: 0
            }, {
                k: "Slow",
                v: 1
            }, {
                k: "Call",
                v: 2
            }, ],
            
            packet: [{
                k: "False",
                v: 0
            }, {
                k: "True",
                v: 1
            }],

            "PI_SHCYA": {

                th: ["app_address", "type_id", "infor_address"],

                entity: {
                    params: {
                        'app_address': 1,
                        'type_id': 0,
                        'infor_address': 1
                    }
                },
                type_id: [{
                    v: 0,
                    k: "遥信"
                }]

            },

            // devicemodel  驱动 Id ;   
            "FCS_MODBUS": {
                th: [
                    'area', 'offset', 'type', 'type_ex', 'access'
                ],

                // 驱动相对应的默认参数; 
                entity: {
                    params: {
                        "area": 0,
                        "offset": 0,
                        "type": 0, //  可选项遂区域在变; 
                        "type_ex": 0, // 遂区域在变; 
                        "access": 0, // 遂区域变;  
                    }
                },
                // 级联属性 start ;  
                // Area 变化是数据变化; 
                // bool : 是否在初始化( _dataType , _accerssType   ); 


                AreaCC: function(point, scope, bool) {
                    // k :area , v: access ;  
                    console.log(scope);
                    var dd = this.type,
                        ac = this.access;


                    function initDtatType() {
                        return point.params.area == 0 || point.params.area == 1 ? [{
                            k: 'Bool',
                            v: 0
                        }] : dd;
                    }

                    function initAccessType() {
                        return (point.params.area == 0 || point.params.area == 2) ? ac : [{
                            v: 0,
                            k: 'Read'
                        }];

                    }


                    // if (bool) {
                        scope._dataType = initDtatType();
                        scope._accerssType = initAccessType();
                    // } else {
                    //     scope.$parent._dataType = initDtatType();
                    //     scope.$parent._accerssType = initAccessType();
                    // }
 


                    if (bool) {
                        return;
                    }

                    if (point.params.area < 2) { // 意思是 co ,di 区时 , 
                        point.params.type = 0;
                        point.params.type_ex = 0;
                    } else {
                        point.params.type = 3;
                        point.params.type_ex = 0;
                    }
                    var cc = {
                        1: 0,
                        3: 0,
                        0: 2,
                        2: 2
                    };
                    point.params.access = cc[point.params.area];


                },
                // Type 变化时 数据变化; 
                TypeCC: function(point) {
                    //if( point.params.area  > 1 ){   // 意思是  hr , ai 区  > 1 ;

                    //  // k: 数据类型 , v: typeEx 值;    

                       var cc = { 0:0 , 1:0 , 2:0 , 8:1, 12:1 , 13:1 }; 
                       point.params.type_ex = cc[ point.params.type ] || 0 ;


                },

                // 级联属性 end ;
                type: [{
                        k: "Bool",
                        v: 0
                    }, {
                        k: "Char",
                        v: 1
                    }, {
                        k: "Byte",
                        v: 2
                    }, {
                        k: "Short",
                        v: 3
                    }, {
                        k: "Word",
                        v: 4
                    }, {
                        k: "Int",
                        v: 5
                    }, {
                        k: "DWord",
                        v: 6
                    }, {
                        k: "Float",
                        v: 7
                    }, {
                        k: "BCD码",
                        v: 8
                    },
                    // {k:"BCD32" , v: 9},
                    {
                        k: "Int64",
                        v: 9
                    }, {
                        k: "UInt64",
                        v: 10
                    }, {
                        k: "Double",
                        v: 11
                    }, {
                        k: "String",
                        v: 12
                    }, {
                        k: "Buffer",
                        v: 13
                    },
                ],
                // 数据区 
                area: [{
                    k: "CO区",
                    v: 0
                }, {
                    k: "DI区",
                    v: 1
                }, {
                    k: "HR区",
                    v: 2
                }, {
                    k: "AI区",
                    v: 3
                }, ],

                // 高低位 字节; 
                hlbyte: [{
                    k: "HightByte",
                    v: 0
                }, {
                    k: "LowByte",
                    v: 1
                }],
                // 读写属性; 
                access: [{
                    k: "Read",
                    v: 0
                }, {
                    k: "Write",
                    v: 1
                }, {
                    k: "ReadWrite",
                    v: 2
                }]
            },

            "PLC_SIEMENS_PPI": {
                // 驱动默认参数; 
                th: [
                    'area', 'offset', 'type', 'type_ex'
                ],
                entity: {
                    params: {
                        area: 0,
                        offset: 0,
                        type: 0,
                        type_ex: 0
                    }
                },

                // bool 是否在初始化;     
                areaCC: function(scope, point, bool) {
                    var t,
                        tt = this.type,

                        area = point.params.area;

                    function cc(data) {
                        // if (bool) {
                        //     scope._dataType = data;
                        // } else {
                        //     scope.$parent._dataType = data; 
                        // }

                        ( scope._dataType = data ) ||  ( scope.$parent._dataType  = data );


                        // console.log( bool ,   scope.$parent._dataType )
                    };

                    if (0 <= area <= 3) {
                        t = angular.copy(this.type);
                        t.splice(9, 1);
                        cc(t);
                        !bool && (point.params.type = 0);

                    }
                    if (area == 4) {
                        cc(tt);
                        !bool && (point.params.type = 0);

                    }

                    if (area == 5 || area == 9) {
                        cc([tt[6], tt[7], tt[8]]);
                        !bool && (point.params.type = 6);

                    }

                    if (area == 6 || area == 8) {
                        !bool && (
                            // point.params.type = undefined ; 
                            // point.params.type_ex = undefined ;
                            point.params.type = 0,
                            point.params.type_ex = 0
                        )

                    }

                    if (area == 7 || area == 10 || area == 11) {
                        cc([tt[3], tt[4], tt[5]]);
                        !bool && (point.params.type = 3);

                    };

                },

                typeCC: function(point) {
                    var area = point.params.area,
                        type = point.params.type;
                    if (type == 0) {
                        point.params.type_ex = 0;
                        return;
                    }
                    if (type == 9) {
                        point.params.type_ex = 1;
                        return;
                    }
                    // point.params.type_ex = undefined ;
                    point.params.type_ex = 0;
                },


                area: [{
                    k: "I 离散输入",
                    v: 0
                }, {
                    k: "Q 离散输出",
                    v: 1
                }, {
                    k: "M 内部内存位",
                    v: 2
                }, {
                    k: "SM 特殊内存位",
                    v: 3
                }, {
                    k: "V 内存变量",
                    v: 4
                }, {
                    k: "T 定时器当前值",
                    v: 5
                }, {
                    k: "T 定时器位",
                    v: 6
                }, {
                    k: "C 计数器当前值",
                    v: 7
                }, {
                    k: "C 计数器位",
                    v: 8
                }, {
                    k: "HC 高速计数器当前值",
                    v: 9
                }, {
                    k: "AI 模拟输入",
                    v: 10
                }, {
                    k: "AO 模拟输出",
                    v: 11
                }],

                type: [{
                    k: "BIT(位 0~7)",
                    v: 0
                }, {
                    k: "BY (8位无符号整型,0~255)",
                    v: 1
                }, {
                    k: "CH (8位有符号整型,-128~127)",
                    v: 2
                }, {
                    k: "US (16位无符号整型, 0~65535)",
                    v: 3
                }, {
                    k: "SS (16位有符号整型, -32768~32767)",
                    v: 4
                }, {
                    k: "SB (16位 BCD 整型, 0~9999)",
                    v: 5
                }, {
                    k: "LG (32位长整型, -2147483648~2147483647)",
                    v: 6
                }, {
                    k: "LB (32位 BCD 格式整型 , 0~99999999)",
                    v: 7
                }, {
                    k: "FL (32位IEEE格式单精度浮点型)",
                    v: 8
                }, {
                    k: "STR(ASCII 字符串型,1~127个字符)",
                    v: 9
                }]
            }


        },

        "tag": {
            //            jjw 变量类型
            //            type: ['Number', 'Boolean', 'String', 'Buffer', 'Array', 'Date', 'Object']
            type: ['Analog', 'Digital']

        },

        message: {
            entity: {
                user_category: "0"
            },

            category: {
                0: '平台用户',
                1: '联系人用户'
            }
        },

        gateway: {
            types: {
                'RS232_1': "RS232",
                'RS232_2': "RS232",
                'RS232_3': "RS232",
                'RS232_4': "RS232",

                'RS485_1': 'RS485',
                'RS485_2': 'RS485',

                'RS422_1': 'RS422',
                'RS422_2': 'RS422'

            },

            baud_rate: [1200, 2400, 4800, 9600, 19200, 38400],
            data_bits: [7, 8],
            stop_bits: [1, 2],
            parity: {
                'none': "无校验",
                'even': "偶校验",
                'odd': "奇校验"
            },

            gps_distance: [50, 100, 250, 500],
            gps_baud_rate: [300, 600, 1200, 2400, 4800, 9600, 19200],


            entity: {
                enable: true,
                baud_rate: 9600,
                data_bits: 8,
                stop_bits: 1,
                parity: 'none',
                delay: 10
            }
        },

        "desc": ""
    }
});

 