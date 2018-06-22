window.onload = function() {
    var name = GetUrlParam("name");
    var filter = document.getElementById("Filter");
    var shadow = document.getElementById("shadow");
    var tabs = document.getElementById("tabs");
    var state = false;
    var pages = [];
    var ip = "http://yzz.iosaps.com:84";
    var mySwiper;
    var timer;
    var n1 = 0;
    var init = true;
    console.log(name);
    var obj = new window_obj();
    console.log(obj.language());

    function window_obj() {
        window_obj.prototype.language = function() {
            return window.myjs ? window.myjs.getLanguage() : "cn";
        }
    }
    //时间日期
    Date.prototype.toLocaleString = function() {
        var show_day = new Array('星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日');
        var h = this.getHours();
        var m = this.getMinutes();
        var s = this.getSeconds();
        var day = this.getDay();
        h = CheckTime(h);
        m = CheckTime(m);
        s = CheckTime(s);

        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日     " + show_day[day - 1] + "    " + h + ":" + m + ":" + s;
    };

    function StartTime() {
        var d = new Date();
        document.getElementById('date').innerHTML = d.toLocaleString()
    }
    filter.onclick = function() {
        console.log(state)
        ShowAndHidden();

    }

    function CheckTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }
    setInterval(StartTime, 1000);
    //时间日期

    if (localStorage.getItem("GroupID") && localStorage.getItem("GroupName")) {
        Init(localStorage.getItem("GroupID"), localStorage.getItem("GroupName"));
    } else {
        Init();
    }
    Cancel = function() {
        console.log("取消！")
        ShowAndHidden();
    }
    Finish = function() {
        console.log("完成！")
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                console.log("value", inputs[i].value);
                localStorage.setItem("GroupID", inputs[i].value.split("|")[0]);
                localStorage.setItem("GroupName", inputs[i].value.split("|")[1]);
                Init(inputs[i].value.split("|")[0], inputs[i].value.split("|")[1]);
                break;
            }
        }
        ShowAndHidden();

    }
    Save = function() {
        var tabtime = document.getElementById("tabtime").value;
        var uptime = document.getElementById("uptime").value;
        console.log(tabtime, uptime, "保存！")
        if (tabtime != "" && Number(tabtime) > 0) {
            localStorage.setItem("tabtime", tabtime);
        } else {
            localStorage.setItem("tabtime", "5");
        }
        if (uptime != "" && Number(uptime) > 0) {
            localStorage.setItem("uptime", uptime);
        } else {
            localStorage.setItem("uptime", "5");
        }
        mySwiper.params.autoplay = Number(tabtime) * 1000;
        console.log(Number(tabtime) * 1000);
        clearInterval(timer);
        var uptimer = Number(localStorage.getItem("uptime")) * 1000 * 60;
        console.log(uptimer);
        timer = setInterval(Init, uptimer);
        ShowAndHidden();
    }

    function ShowAndHidden() {
        state = !state;
        if (state == true) {
            shadow.style.left = "0";
            tabs.style.left = "20%";
        } else {
            shadow.style.left = "100%";
            tabs.style.left = "100%";
        }
    }

    function Init(index, GroupName) {
        n1 = index ? index : n1;
        var data = [];
        var request = new XMLHttpRequest();
        request.open('GET', ip + '/ESignage/GetGroupLine.ashx?remark=' + name, true);
        request.send();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                // console.log(data)
                // console.log(data.length)
                var tabs_container = document.getElementById("tabs_container");
                if (data.length > 0) {
                    tabs_container.innerHTML = "";
                    // data.forEach(element => {
                    //     if (element.GroupID == index) {
                    //         console.log(element.GroupID, index);
                    //         tabs_container.innerHTML += '<p><span>' + element.GroupName + '：' + '</span><input class="radio" type="radio" checked="checked" name="GroupName" value=' + element.GroupID + "|" + element.GroupName + ' /></p>';
                    //     } else {
                    //         tabs_container.innerHTML += '<p><span>' + element.GroupName + '：' + '</span><input class="radio" type="radio" name="GroupName" value=' + element.GroupID + "|" + element.GroupName + ' /></p>';
                    //     }
                    // });
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data[i].GroupName);
                        if (data[i].GroupID == index) {
                            console.log(data[i].GroupID, index);
                            tabs_container.innerHTML += '<p><span>' + data[i].GroupName + '：' + '</span><input class="radio" type="radio" checked="checked" name="GroupName" value=' + data[i].GroupID + "|" + data[i].GroupName + ' /></p>';
                        } else {
                            tabs_container.innerHTML += '<p><span>' + data[i].GroupName + '：' + '</span><input class="radio" type="radio" name="GroupName" value=' + data[i].GroupID + "|" + data[i].GroupName + ' /></p>';
                        }
                    }
                    tabs_container.innerHTML += '<div style="width:100%;display:flex;justify-content: flex-end;flex-flow:wrap;margin-bottom:1rem;">' +
                        // '<p class="btn_container"><button class="cancel" onclick="Cancel()">退出</button></p>' +
                        '<p class="btn_container"><button class="finish" onclick="Finish()">确定</button></p>' +
                        '</div>'
                    tabs_container.innerHTML += '<div style="width:100%;display:flex;justify-content: flex-end;align-items:center;flex-flow:wrap;margin-bottom:1rem;">' +
                        '<p class="time_text">' + '<span>设置轮播时间</span>' +
                        '<select id="tabtime">' +
                        '<option value ="3">3</option>' +
                        '<option value ="4">4</option>' +
                        '<option value="5">5</option>' +
                        '<option value="6">6</option>' +
                        '<option value="7">7</option>' +
                        '<option value="8">8</option>' +
                        '<option value="9">9</option>' +
                        '<option value="10">10</option>' +
                        '<option value="15">15</option>' +
                        '<option value="20">20</option>' +
                        '</select>' + '<span>(秒) </span></p>' +
                        '<p class="time_text">' + '<span>设置刷新时间</span>' +
                        '<select id="uptime">' +
                        '<option value ="1">1</option>' +
                        '<option value ="2">2</option>' +
                        '<option value="3">3</option>' +
                        '<option value="4">4</option>' +
                        '<option value="5">5</option>' +
                        '<option value="6">6</option>' +
                        '<option value="7">7</option>' +
                        '<option value="8">8</option>' +
                        '<option value="9">9</option>' +
                        '<option value="10">10</option>' +
                        '<option value="20">20</option>' +
                        '</select>' + '<span>(分)</span> </p>' +
                        '<p class="btn_container"><button class="save" onclick="Save()">保存</button></p></div>'
                    tabs_container.innerHTML += '<div style="width:100%;display:flex;justify-content: flex-end;flex-flow:wrap;margin-bottom:1rem;">' +
                        '<p class="btn_container"><button class="cancel" onclick="Cancel()">退出</button></p>' +
                        '</div>'
                    var tabtime = document.getElementById("tabtime");
                    console.log(tabtime.value);
                    for (var v = 0; v < tabtime.length; v++) {
                        if (localStorage.getItem("tabtime")) {
                            if (localStorage.getItem("tabtime") == tabtime.options[v].value) {
                                tabtime.value = tabtime.options[v].value;
                            }
                        }
                    }
                    var uptime = document.getElementById("uptime");
                    for (var v = 0; v < uptime.length; v++) {
                        if (localStorage.getItem("uptime")) {
                            if (localStorage.getItem("uptime") == uptime.options[v].value) {
                                uptime.value = uptime.options[v].value;
                            }
                        }
                    }
                    document.getElementById("GroupName").innerHTML = GroupName ? GroupName : data[0].GroupName;
                    GetList(data, n1);
                }
            } else {
                // console.log(request.status);
            }
        }

    }

    function GetList(obj, GroupID) {
        var list = [];
        var request = new XMLHttpRequest();
        request.open('GET', ip + '/ESignage/GetGroupLineState.ashx?remark=' + name + "&groupId=" + GroupID, true);
        request.send();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(req.responseText);
                list = JSON.parse(this.responseText);
                var container = document.getElementById("container");
                container.innerHTML = "";
                if (list.length > 0) {
                    var text = "";
                    for (var i = 0; i < list.length; i++) {
                        document.getElementById("AdminName").innerHTML = "组长：" + list[i].Leader;
                        var text = '<div class="box"><div class="listname"><span>' + list[i].LineName + '</span></div><table>'
                        for (var b = 0; b < list[i].PoList.length; b++) {
                            text +=
                                '<tr><td class="Jo">' + list[i].PoList[b].PoCode + '</td>' +
                                '<td class="CustomerName">' + list[i].PoList[b].CustomerName + '</td>' +
                                '<td class="Pattern">' + list[i].PoList[b].Pattern + '</td>' +
                                '<td class="Color">' + list[i].PoList[b].Color + '</td>' +
                                '<td class="Size">' + list[i].PoList[b].Size + '</td>' +
                                '<td class="CompleteAmount">' + list[i].PoList[b].PlanAmount + '</td>' +
                                '<td class="CompleteAmount">' + list[i].PoList[b].CutAmount + '</td>' +
                                '<td class="CompleteAmount" style="color:#fec107;">' + list[i].PoList[b].FinishAmount + '</td>' +
                                '<td class="FactoryDeliveryDate">' + list[i].PoList[b].FactoryDeliveryDate + '</td>' +
                                '<td class="DeliveryDate">' + list[i].PoList[b].DeliveryDate + '</td></tr>'
                        }

                        text += '</table ></div>'
                        container.innerHTML += text;
                    }
                    Push_Array(list);
                } else {
                    if (init == false) {
                        console.log("!!!")
                        ReMovePage();
                    }
                }
            }
        }
    }



    function Push_Array(list) {
        pages = [];
        for (var i = 0; i < list.length; i++) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var datas = JSON.parse(this.responseText);
                    pages.push(datas);
                    if (pages.length == list.length && datas != "-1") {
                        init = false;
                        var text = "";
                        for (var b = 0; b < pages.length; b++) {
                            var value = "";
                            for (var a = 0; a < pages[b].PeriodList.length; a++) {
                                value += '<tr>' +
                                    '<td style="flex: 0 0 20%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].Period + '</td>' +
                                    '<td style="flex: 0 0 15%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].TargetAmount + '</td>' +
                                    '<td style="flex: 0 0 15%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].FinishAmount + '</td>' +
                                    '<td style="flex: 0 0 15%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].EFF + '%</td>' +
                                    '<td style="flex: 0 0 15%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].ReworkAmount + '</td>' +
                                    '<td style="flex: 0 0 15%;border-left:none;font-size:1.5rem;">' + pages[b].PeriodList[a].ReworkRate + '%</td>' +
                                    '</tr>'
                            }
                            console.log("进入！")
                            text +=
                                '<div class="page swiper-slide">' +
                                '<div class="header">' +
                                '<div class="header_title" >' +
                                '<h2 class="title_css" >生产线：' + list[b].LineName + ' 今日生产情况</h2>' +
                                '<div class="info">' +
                                '<span style="color:#fec107;">生产单号：' + pages[b].CurrentPo.PoCode + '</span>' +
                                '<span >订单数：' + pages[b].CurrentPo.Amount + '件</span>' +
                                '<span >人数：' + pages[b].CurrentPo.WorkerAmount + '人</span>' +
                                '</div>' +
                                '<div class="info">' +
                                '<span >节拍时间：' + pages[b].CurrentPo.BeatTime + '秒</span>' +
                                '<span >目标生产能力：' + pages[b].CurrentPo.TargetCapacity + '件/8小时</span>' +
                                '</div>' +
                                '</div>' +
                                '<div class="header_img"><div style="width:50%;">' +
                                '<img  class="Img" src=' + pages[b].CurrentPo.ImgUrl + '>' + '</div></div>' +
                                '</div>' +
                                '<div style="display:flex;width:100%;border-top:1px solid #2756ca;">' +
                                '<div class="speedometer_container">' +
                                '<div class="item">' +
                                '<div class="speedometer">' +
                                '<div style="width:50%;position:relative;display:flex;align-items:center;justify-content: center;"><img src="images/speedometer.png" style="width:100%;">' +
                                '<span class="num0">0</span>' +
                                '<span class="num20">20</span>' +
                                '<span class="num40">40</span>' +
                                '<span class="num60">60</span>' +
                                '<span class="num80">80</span>' +
                                '<span class="num100">100</span>' +
                                '<img src="images/arrow.png" style="position:absolute;bottom:0;width:55%;transform-origin: center;transition: 1s; transform: rotate(' + 1.8 * pages[b].FinishRate + 'deg);">' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<h4 style="color:#fff;margin-top:0.5rem;margin-bottom:0;">效率' + pages[b].FinishRate + '%</h4>' +
                                '<h3 class="item_amount">' +
                                // '<span style="color:#fff;">效率' + pages[b].FinishRate + '%</span>' +
                                '<span style="color:#32fdf9;">总完成数：' + pages[b].FinishAmount + '件</span>' +
                                '<span style="color:#32fdf9;">总目标数：' + pages[b].TargetAmount + '件</span>' +
                                '</h3>' +
                                '<div class="item">' +
                                '<div class="speedometer">' +
                                '<div style="width:50%;position:relative;display:flex;align-items:center;justify-content: center;"><img src="images/speedometer.png" style="width:100%;">' +
                                '<span class="num0">0</span>' +
                                '<span class="num20">20</span>' +
                                '<span class="num40">40</span>' +
                                '<span class="num60">60</span>' +
                                '<span class="num80">80</span>' +
                                '<span class="num100">100</span>' +
                                '<img src="images/arrow.png" style="position:absolute;bottom:0;width:55%;transform-origin: center;transition: 1s; transform: rotate(' + 1.8 * pages[b].DayFinishRate + 'deg);">' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<h4 style="color:#fff;margin-top:0.5rem;margin-bottom:0;">效率' + pages[b].DayFinishRate + '%</h4>' +
                                '<h3 class="item_amount">' +
                                // '<span style="color:#fff;">效率' + pages[b].DayFinishRate + '%</span>' +
                                '<span style="color:#32fdf9;">日完成数：' + pages[b].DayFinishAmount + '件</span>' +
                                '<span style="color:#32fdf9;">日目标数：' + pages[b].DayTargetAmount + '件</span>' +
                                '</h3>' +
                                '</div>' +
                                '<div class="table_container">' +
                                '<table>' +
                                '<tbody>' +
                                '<tr>' +
                                '<th style="flex: 0 0 20%;">时间段</th>' +
                                '<th>目标</th>' +
                                '<th>完成</th>' +
                                '<th>效率</th>' +
                                '<th>返工数</th>' +
                                '<th>返工率</th>' +
                                '</tr>' + value +
                                '</tbody>' +
                                '</table>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                        }
                        var objs = ReMovePage();
                        objs.innerHTML += text;
                        swiper();
                        var uptimer = localStorage.getItem("uptime") ? Number(localStorage.getItem("uptime") * 1000 * 60) : 300000;
                        clearInterval(timer);
                        timer = setInterval(Init, uptimer);
                    } else {
                        console.log("data-1");
                        ReMovePage();
                    }
                }
            }
            request.open('GET', ip + '/ESignage/GetLinePoState.ashx?remark=' + name + "&lineId=" + list[i].LineId + "&poId=" + list[i].EarlyPoId + "&eventid=" + list[i].PoList[0].EventId, false);
            request.send();
        }

    }

    function ReMovePage() {
        var obj = document.getElementById("pages");
        while (obj.children.length != 1) {
            var repage = document.getElementsByClassName("page");
            obj.removeChild(repage[0]);
        }
        return obj;
    }

    function swiper() {
        time = localStorage.getItem("tabtime") ? Number(localStorage.getItem("tabtime") * 1000) : 8000;
        mySwiper = new Swiper('.swiper-container', {
            autoplay: time,
            pagination: '.swiper-pagination',
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            loop: false,
            autoplayDisableOnInteraction: false,
            onSlideChangeEnd: function(swiper) {
                console.log(swiper.activeIndex)
                if (swiper.activeIndex == 0) {
                    document.getElementById("faceimg").style.display = "flex";
                    document.getElementById("listtitle").style.display = "flex";
                    document.getElementById("Group").style.marginBottom = "0";
                    document.getElementById("Group").style.color = "#48eefe";
                    document.getElementById("date").style.color = "#48eefe";
                    document.getElementsByTagName("header")[0].style.background = "none";
                    // console.log("主页！");
                } else {
                    document.getElementById("faceimg").style.display = "none";
                    document.getElementById("listtitle").style.display = "none";
                    document.getElementById("Group").style.marginBottom = "1.2rem";
                    document.getElementById("Group").style.color = "#fff";
                    document.getElementById("date").style.color = "#fff";
                    document.getElementsByTagName("header")[0].style.background = "#2756ca";
                }
            }
        })
    }

    function GetUrlParam(paraName) {　　　　
        var url = document.location.toString();　　　　
        var arrObj = url.split("?");
        if (arrObj.length > 1) {　　　　　　
            var arrPara = arrObj[1].split("&");　　　　　　
            var arr;
            for (var i = 0; i < arrPara.length; i++) {　　　　　　　　
                arr = arrPara[i].split("=");　　　　
                if (arr != null && arr[0] == paraName) {　　　　　　　　　　
                    return arr[1];　　　　　　　　
                }　　　　　　
            }　　　　　　
            return "";　　　　
        }　　　　
        else {　　　　　　
            return "jiexing";　　　　
        }　　
    }
}