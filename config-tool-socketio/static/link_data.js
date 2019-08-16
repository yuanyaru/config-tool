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
    namespace = '/station_data';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    // 监听回复的消息
    socket.on('find_response', function(res) {
        $("#station").empty();
        str1 = '<li id="station"><span class="folder" onclick="show_link_table()">厂站列表</span></li>';
        $("#browser").html(str1);
        // alert(res[1].NAME);
        for(var i = 0; i<res.length; i++) {
            str2 = '<li class="closed"><span class="folder" id="station">'+res[i].NAME+'</span>'+
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
    namespace = '/station_data';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    //发送消息
    socket.emit('find_event',{'param':'socket连接成功！'});

    // 监听回复的消息
    socket.on('find_response', function(res) {
        // alert(res.length)
        clearLinkTable();
        for(var i = 0; i<res.length; i++) {
            str = "<tr><td><input type='checkbox' name='station_ID'/>" + "</td>"
            + "<td>" + res[i].ID
            + "</td><td>" + res[i].NAME
            + "</td><td>" + res[i].DESCRIBE
            + "</td><td>" + res[i].RULEID
            + "</td><td>" + res[i].ADDRESS
            + "</td><td>" + res[i].PORT
            + "</td><td>" + res[i].ROLE + "</td></tr>";

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
    new_data.push(IDs); new_data.push(NAMEs); new_data.push(DESCRIBEs); new_data.push(RULEIDs);
    new_data.push(ADDRESSs); new_data.push(PORTs); new_data.push(ROLEs);
    var new_data_ID_len = new_data[0].length;
    // alert(new_data_ID_len);
    if (new_data_ID_len > 0) {
        namespace = '/new_station_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        // 发送消息
        socket.emit('insert_event', new_data);

        // 监听回复的消息
        socket.on('insert_response', function (res){
            alert(res);
            show_db_station_data();
            getStation();
        });
    }
    else {
        alert("请先选择要保存的行！")
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
        namespace = '/delete_station_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        socket.emit('delete_event', station_IDs);

        socket.on('delete_response', function(res) {
            alert(res);
            show_db_station_data();
            getStation();
        });
    }
    else {
        alert("请先选择要删除的行！")
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
    update_data.push(IDs); update_data.push(NAMEs); update_data.push(DESCRIBEs); update_data.push(RULEIDs);
    update_data.push(ADDRESSs); update_data.push(PORTs); update_data.push(ROLEs);
    var update_data_ID_len = update_data[0].length;
    if (update_data_ID_len > 0) {
        namespace = '/update_station_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        // 发送消息
        socket.emit('update_event', update_data);

        // 监听回复的消息
        socket.on('update_response', function (res) {
            alert(res);
            show_db_station_data();
            getStation();
        });
    } else {
        alert("请先选择要修改的行！")
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