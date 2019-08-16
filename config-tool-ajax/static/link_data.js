function show_link_table() {
　　document.getElementById("link_table").style.display="block";
    document.getElementById("yx_table").style.display="none";
}

// 清空表格
function clearLinkTable() {
    // $('table tr').not(':eq(0)').empty();
    $("#tBody_link").text("");
}

/*function re_station() {
    $("#browser").load(location.href + " #browser");
}*/

function getStation() {
    $.get("/station_data", function(res){
        $("#station").empty();
        str1 = '<li id="station"><span class="folder" onclick="show_link_table()">厂站列表</span></li>';
        $("#browser").html(str1);
        // alert(res[1].NAME);
        // 将JSON字符串反序列化成JSON对象
        var res2Json = JSON.parse(res);
        // alert(res2Json.type);
        for(var i = 0; i<res2Json.length; i++) {
            str2 = '<li class="closed"><span class="folder" id="station">'+ res2Json[i].NAME +'</span>'+
                '<ul>'+'<li><span class="file" onclick="show_yx_table()">遥信</span></li>'+
                '</ul>'+'<ul>'+'<li><span class="file">遥测</span></li>'+'</ul>'+'<ul>'+
                '<li><span class="file">遥控</span></li>'+'</ul>'+'<ul>'+'<li><span class="file">遥调</span></li>'+
                '</ul>'+'<ul>'+'<li><span class="file">事件</span></li>'+'</ul>'+'</li>'+'</ul>'+
                '</li>'

            $("#station").append(str2);
        }
        $("#browser").treeview();
    });
}

// 显示数据库的数据
function show_db_station_data() {
    $.get("/station_data", function(res){
        // alert(res);
        clearLinkTable();
        // 将JSON字符串反序列化成JSON对象
        var res2Json = JSON.parse(res);
        // alert(res2Json);
        // alert(res2Json.length);
        // var res2Json = eval(res);
        // alert(res2Json);
        // console.log(res2Json);
        for(var i = 0; i<res2Json.length; i++) {
            str = "<tr><td><input type='checkbox' name='station_ID'/>" + "</td>"
            + "<td>" + res2Json[i].id
            + "</td><td>" + res2Json[i].NAME
            + "</td><td>" + res2Json[i].DESCRIBE
            + "</td><td>" + res2Json[i].RULEID
            + "</td><td>" + res2Json[i].ADDRESS
            + "</td><td>" + res2Json[i].PORT
            + "</td><td>" + res2Json[i].ROLE + "</td></tr>";

            // 追加到table中
            $("#tBody_link").append(str);
        }
    });
}

// var rowNum = 0;
// 在表格尾部增添一行
function addStationRow(){
    str = "<tr><td><input type='checkbox' class='i-checks' name='station_ID'/>" + "</td>"
            + "<td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"  + "</td></tr>";

    // 追加到table中
    $("#tBody_link").append(str);
    // rowNum+=1;
}

// 删除尾部添加的行
function deleteStationRow() {
    var i = 0
    $("input[type='checkbox'][name='station_ID']").each(function() {
        if(this.checked) {
            i = i + 1;
            $(this).parents('tr').remove();
        }
    });
    if (i > 0) {
        alert("删除成功！")
    }
    else {
        alert("请先选择要删除的行！")
    }
}

// 添加
function insert_link_data() {
    var IDs = new Array(); var NAMEs = new Array();
    var DESCRIBEs = new Array(); var RULEIDs = new Array();
    var ADDRESSs = new Array(); var PORTs = new Array();
    var ROLEs = new Array(); var new_data = new Array();

    $("input[type='checkbox'][name='station_ID']").each(function() {
        if(this.checked) {
            var ID = $(this).parents('tr').children().eq(1).text();
            var NAME = $(this).parents('tr').children().eq(2).text();
            var DESCRIBE = $(this).parents('tr').children().eq(3).text();
            var RULEID = $(this).parents('tr').children().eq(4).text();
            var ADDRESS = $(this).parents('tr').children().eq(5).text();
            var PORT = $(this).parents('tr').children().eq(6).text();
            var ROLE = $(this).parents('tr').children().eq(7).text();

            IDs.push(ID); NAMEs.push(NAME); DESCRIBEs.push(DESCRIBE); RULEIDs.push(RULEID);
            ADDRESSs.push(ADDRESS); PORTs.push(PORT); ROLEs.push(ROLE);
        }
    });

    new_data.push(JSON.stringify(IDs)); new_data.push(JSON.stringify(NAMEs));
    new_data.push(JSON.stringify(DESCRIBEs)); new_data.push(JSON.stringify(RULEIDs));
    new_data.push(JSON.stringify(ADDRESSs)); new_data.push(JSON.stringify(PORTs));
    new_data.push(JSON.stringify(ROLEs));

    var new_data_ID_len = new_data[0].length;
    // alert(new_data_ID_len);
    if (new_data_ID_len > 0) {
        $.post("/insert_station", {'data': JSON.stringify(new_data)}, function(res){
            alert(res);
            show_db_station_data();
            getStation();
        });
    } else {
        alert("请先选择要保存的行！")
    }
}

// 修改
function update_db_station_data(){
    // alert("更新表格中的改动到数据库");
    var IDs = new Array(); var NAMEs = new Array();
    var DESCRIBEs = new Array(); var RULEIDs = new Array();
    var ADDRESSs = new Array(); var PORTs = new Array();
    var ROLEs = new Array(); var update_data = new Array();

    $("input[type='checkbox'][name='station_ID']").each(function() {
        if(this.checked) {
            var ID = $(this).parents('tr').children().eq(1).text();
            var NAME = $(this).parents('tr').children().eq(2).text();
            var DESCRIBE = $(this).parents('tr').children().eq(3).text();
            var RULEID = $(this).parents('tr').children().eq(4).text();
            var ADDRESS = $(this).parents('tr').children().eq(5).text();
            var PORT = $(this).parents('tr').children().eq(6).text();
            var ROLE = $(this).parents('tr').children().eq(7).text();

            IDs.push(ID); NAMEs.push(NAME); DESCRIBEs.push(DESCRIBE); RULEIDs.push(RULEID);
            ADDRESSs.push(ADDRESS); PORTs.push(PORT); ROLEs.push(ROLE);
         }
    });

    update_data.push(JSON.stringify(IDs)); update_data.push(JSON.stringify(NAMEs));
    update_data.push(JSON.stringify(DESCRIBEs)); update_data.push(JSON.stringify(RULEIDs));
    update_data.push(JSON.stringify(ADDRESSs)); update_data.push(JSON.stringify(PORTs));
    update_data.push(JSON.stringify(ROLEs));

    var update_data_ID_len = update_data[0].length;
    if (update_data_ID_len > 0) {
        $.post("/update_station", {'data': JSON.stringify(update_data)}, function(res){
            alert(res);
            show_db_station_data();
            getStation();
        });
    } else {
        alert("请先选择要修改的行！")
    }
}

// 删除
function delete_station_data() {
    // alert("删除选中的行");
    var station_IDs = new Array();
    $("input[type='checkbox'][name='station_ID']").each(function() {
        if(this.checked) {
            var station_ID = $(this).parents('tr').children().eq(1).text();
            // alert(station_ID);
            station_IDs.push(station_ID)
        }
    });

    var station_IDs_len = station_IDs.length;
    if (station_IDs_len > 0) {
        $.post("/delete_station", {'ids': JSON.stringify(station_IDs)}, function(res){
            alert(res);
            show_db_station_data();
            getStation();
        });
    } else {
        alert("请先选择要删除的行！")
    }
}

// 全选按钮
$(function() {
	$("#selectAllStation").bind("click",function(){
		if($(this).prop("checked")){
			$("input[type='checkbox']").not(this).prop("checked",true);
		}else{
			$("input[type='checkbox']").not(this).prop("checked",false);
		}
	});
});