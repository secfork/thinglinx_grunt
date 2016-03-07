何迪江(1158242)  14:29:23

var trigger_1 = {
	name : "trigger_1",
	// 触发且仅触发一次 type default to 1
	conditions : [
		{
			verb : null,
			exp : {
				left : { fn:"PV", args:"tag_1" },    //   fn: pv  || null ; 
				op : ">=",
				right : { fn:"pv", args:"tag_2" }
			}
		} ,
		{
			verb : 'and', //  and || or ;  
			exp : {
				left : { fn:"PV", args:"tag_2" },
				op : ">=",
				right : { fn:null, args:"5.0" }
			}
		}
	],
	action : "alarm",  // ""
	params : {
		//tags : ["tag_1" ,"tag_2" , "tag_2"],   // 
		// type : "HHL",
		class_id : 1,
		severity : 2,	
		desc:""
		// limit : [ 'tag_1','tag_2' ,5.0]    // 
	}
};
