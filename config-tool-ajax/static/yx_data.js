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
    $.get("/yx_data", function(res){
        // alert(res);
        clearYxTable();
        // 将JSON字符串反序列化成JSON对象
        var res2Json = JSON.parse(res);
        for(var i = 0; i<res2Json.length; i++) {
            str = "<tr><td><input type='checkbox' name='yx_ID'/>"
            + "</td><td>" + res2Json[i].id
            + "</td><td>" + res2Json[i].NAME
            + "</td><td>" + res2Json[i].DESCRIBE
            + "</td><td>" + res2Json[i].ASDU
            + "</td><td>" + res2Json[i].WORD
            + "</td><td>" + res2Json[i].BYTE
            + "</td><td>" + res2Json[i].NUMBYTE
            + "</td><td>" + res2Json[i].ADDRESS + "</td></tr>";

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

    new_data.push(JSON.stringify(IDs)); new_data.push(JSON.stringify(NAMEs));
    new_data.push(JSON.stringify(DESCRIBEs)); new_data.push(JSON.stringify(ASDUs));
    new_data.push(JSON.stringify(WORDs)); new_data.push(JSON.stringify(BYTEs));
    new_data.push(JSON.stringify(NUMBYTEs)); new_data.push(JSON.stringify(ADDRESSs));

    var new_data_ID_len = new_data[0].length;
    // alert(new_data_ID_len);
    // alert(new_data)
    if (new_data_ID_len > 0) {
        $.post("/insert_yx", {'data': JSON.stringify(new_data)}, function(res){
            alert(res);
            show_db_yx_data();
        });
    } else {
        alert("请先选择要保存的行！")
    }
}

// 修改
function update_db_yx_data(){
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

    update_data.push(JSON.stringify(IDs)); update_data.push(JSON.stringify(NAMEs));
    update_data.push(JSON.stringify(DESCRIBEs)); update_data.push(JSON.stringify(ASDUs));
    update_data.push(JSON.stringify(WORDs)); update_data.push(JSON.stringify(BYTEs));
    update_data.push(JSON.stringify(NUMBYTEs)); update_data.push(JSON.stringify(ADDRESSs));

    var update_data_ID_len = update_data[0].length;
    if (update_data_ID_len > 0) {
        $.post("/update_yx", {'data': JSON.stringify(update_data)}, function(res){
            alert(res);
            show_db_yx_data();
        });
    } else {
        alert("请先选择要修改的行！")
    }
}

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
        $.post("/delete_yx", {'ids': JSON.stringify(yx_IDs)}, function(res){
            alert(res);
            show_db_yx_data();
        });
    } else {
        alert("请先选择要删除的行！")
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