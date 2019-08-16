$(document).ready(function () {
    var ss=document.getElementById('time').getElementsByTagName('span');
    function changeTime() {
        var time = new Date();
        ss[0].innerHTML = time.getFullYear().toString();
        ss[1].innerHTML = time.getMonth()+1;
        ss[2].innerHTML = time.getDate().toString();
        ss[3].innerHTML = time.getHours().toString();
        ss[4].innerHTML = time.getMinutes().toString();
        ss[5].innerHTML = time.getSeconds().toString();
    }
    changeTime();
    setInterval(function(){
        changeTime();
    },1000)

    $("#contect").click(function () {
        window.confirm("感谢您的使用！\n" +
                        "如果在使用过程中有任何疑问，请联系平台研发部");
    });

    $("#about").click(function () {
        window.confirm("本产品：点表配置工具\n" +
                        "版本：v1.0.0");
    });

    /*$("#browser").treeview({
        toggle: function() {
            console.log("%s was toggled.", $(this).find(">span").text());
        }
    });*/

    $("#browser").treeview();
});

function show_yx_table() {
　　document.getElementById("yx_table").style.display="block";
    document.getElementById("link_table").style.display="none";
}

// 清空表格
function clearYxTable() {
    // $('table tr').not(':eq(0)').empty();
    $("#tBody_yx").text("");
}

// 显示数据库的数据
function show_db_yx_data() {
    // alert("显示数据库里遥信数据")
    namespace = '/yx_data';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    //发送消息
    socket.emit('find_event',{'param':'socket连接成功！'});

    // 监听回复的消息
    socket.on('find_response', function(res) {
        // alert(res.length)
        clearYxTable();
        for(var i = 0; i<res.length; i++) {
            str = "<tr><td><input type='checkbox' name='yx_ID'/>" + "</td>"
            + "<td>" + res[i].ID
            + "</td><td>" + res[i].NAME
            + "</td><td>" + res[i].DESCRIBE
            + "</td><td>" + res[i].ASDU
            + "</td><td>" + res[i].WORD
            + "</td><td>" + res[i].BYTE
            + "</td><td>" + res[i].NUMBYTE
            + "</td><td>" + res[i].ADDRESS + "</td></tr>";

            // 追加到table中
            $("#tBody_yx").append(str);
        }
    });
}

// var rowNum = 0;
// 在表格尾部增添一行
function addYxRow(){
    // alert("在表格尾部添加一行")
    /*str = "<tr><td><input type='checkbox' class='i-checks' name='yx_ID'/>" + "</td>"
            + "<td><input style='width:120px' name='ID' id='ID' value='' required>"
            + "</td><td><input style='width:120px' name='NAME' id='NAME' value='' required>"
            + "</td><td><input style='width:120px' name='DESCRIBE', id='DESCRIBE' value=''/>"
            + "</td><td><input style='width:120px' name='ASDU' id='ASDU' value=''/>"
            + "</td><td><input style='width:120px' name='WORD' id='WORD' value=''/>"
            + "</td><td><input style='width:120px' name='BYTE' id='BYTE' value=''/>"
            + "</td><td><input style='width:120px' name='NUMBYTE' id='NUMBYTE' value=''/>"
            + "</td><td><input style='width:120px' name='ADDRESS' id='ADDRESS' value=''/>"  + "</td></tr>";*/

    str = "<tr><td><input type='checkbox' class='i-checks' name='yx_ID'/>" + "</td>"
            + "<td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"
            + "</td><td>"  + "</td></tr>";

    // 追加到table中
    $("#tBody_yx").append(str);
    // rowNum+=1;
}

// 删除尾部添加的行
function deleteYxRow() {
    var i = 0
    $("input[type='checkbox'][name='yx_ID']").each(function() {
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
function insert_yx_data() {
    var IDs = new Array(); var NAMEs = new Array();
    var DESCRIBEs = new Array(); var ASDUs = new Array();
    var WORDs = new Array(); var BYTEs = new Array();
    var NUMBYTEs = new Array(); var ADDRESSs = new Array();
    var new_data = new Array();

    $("input[type='checkbox'][name='yx_ID']").each(function() {
        if(this.checked) {
            var ID = $(this).parents('tr').children().eq(1).text();
            var NAME = $(this).parents('tr').children().eq(2).text();
            var DESCRIBE = $(this).parents('tr').children().eq(3).text();
            var ASDU = $(this).parents('tr').children().eq(4).text();
            var WORD = $(this).parents('tr').children().eq(5).text();
            var BYTE = $(this).parents('tr').children().eq(6).text();
            var NUMBYTE = $(this).parents('tr').children().eq(7).text();
            var ADDRESS = $(this).parents('tr').children().eq(8).text();

            IDs.push(ID); NAMEs.push(NAME); DESCRIBEs.push(DESCRIBE); ASDUs.push(ASDU);
            WORDs.push(WORD); BYTEs.push(BYTE); NUMBYTEs.push(NUMBYTE); ADDRESSs.push(ADDRESS);
        }
    });
    new_data.push(IDs); new_data.push(NAMEs); new_data.push(DESCRIBEs); new_data.push(ASDUs);
    new_data.push(WORDs); new_data.push(BYTEs); new_data.push(NUMBYTEs); new_data.push(ADDRESSs);
    var new_data_ID_len = new_data[0].length;
    // alert(new_data_ID_len);
    if (new_data_ID_len > 0) {
        namespace = '/new_yx_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        // 发送消息
        socket.emit('insert_event', new_data);

        // 监听回复的消息
        socket.on('insert_response', function (res){
            alert(res);
            show_db_yx_data();
        });
    }
    else {
        alert("请先选择要保存的行！")
    }
}

/*// 尾部添加一条数据
function insert_yx_data(){
    // alert("在数据库中插入新增的数据");
    // alert(rowNum);
    if (rowNum >= 1) {
        var ID = document.getElementById("ID").value;
        var NAME = document.getElementById("NAME").value;
        var DESCRIBE = document.getElementById("DESCRIBE").value;
        var ASDU = document.getElementById("ASDU").value;
        var WORD = document.getElementById("WORD").value;
        var BYTE = document.getElementById("BYTE").value;
        var NUMBYTE = document.getElementById("NUMBYTE").value;
        var ADDRESS = document.getElementById("ADDRESS").value;
        if (ID == "") {
            alert("请输入ID！");
        } else if (NAME == "") {
            alert("请输入NAME！");
        } else {
            var new_data = new Array(ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS);

            namespace = '/new_data';
            var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

            // 发送消息
            socket.emit('insert_event', new_data);

            // 监听回复的消息
            socket.on('insert_response', function (res) {
                alert(res);
                show_db_yx_data();
            });
        }
    } else {
        alert("请先选择要添加的行！");
    }
}*/

// 删除
function delete_yx_data() {
    // alert("删除选中的行");
    var yx_IDs = new Array();
    $("input[type='checkbox'][name='yx_ID']").each(function() {
        if(this.checked) {
            var yx_ID = $(this).parents('tr').children().eq(1).text();
            // alert(yx_ID);
            yx_IDs.push(yx_ID)
        }
    });
    var yx_IDs_len = yx_IDs.length;
    if (yx_IDs_len > 0) {
        namespace = '/delete_yx_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        socket.emit('delete_event', yx_IDs);

        socket.on('delete_response', function(res) {
            alert(res);
            show_db_yx_data();
        });
    }
    else {
        alert("请先选择要删除的行！")
    }
}

// 修改
function update_db_yx_data(){
    // alert("更新表格中的改动到数据库");
    var IDs = new Array(); var NAMEs = new Array();
    var DESCRIBEs = new Array(); var ASDUs = new Array();
    var WORDs = new Array(); var BYTEs = new Array();
    var NUMBYTEs = new Array(); var ADDRESSs = new Array();
    var update_data = new Array();
    $("input[type='checkbox'][name='yx_ID']").each(function() {
        if(this.checked) {
            var ID = $(this).parents('tr').children().eq(1).text();
            var NAME = $(this).parents('tr').children().eq(2).text();
            var DESCRIBE = $(this).parents('tr').children().eq(3).text();
            var ASDU = $(this).parents('tr').children().eq(4).text();
            var WORD = $(this).parents('tr').children().eq(5).text();
            var BYTE = $(this).parents('tr').children().eq(6).text();
            var NUMBYTE = $(this).parents('tr').children().eq(7).text();
            var ADDRESS = $(this).parents('tr').children().eq(8).text();

            IDs.push(ID); NAMEs.push(NAME); DESCRIBEs.push(DESCRIBE); ASDUs.push(ASDU);
            WORDs.push(WORD); BYTEs.push(BYTE); NUMBYTEs.push(NUMBYTE); ADDRESSs.push(ADDRESS);
         }
    });
    update_data.push(IDs); update_data.push(NAMEs); update_data.push(DESCRIBEs); update_data.push(ASDUs);
    update_data.push(WORDs); update_data.push(BYTEs); update_data.push(NUMBYTEs); update_data.push(ADDRESSs);
    var update_data_ID_len = update_data[0].length;
    if (update_data_ID_len > 0) {
        namespace = '/update_yx_data';
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

        // 发送消息
        socket.emit('update_event', update_data);

        // 监听回复的消息
        socket.on('update_response', function (res) {
            alert(res);
            show_db_yx_data();
        });
    } else {
        alert("请先选择要修改的行！")
    }
}

// 全选按钮
$(function() {
	$("#selectAllYx").bind("click",function(){
		if($(this).prop("checked")){
			$("input[type='checkbox']").not(this).prop("checked",true);
		}else{
			$("input[type='checkbox']").not(this).prop("checked",false);
		}
	});
});