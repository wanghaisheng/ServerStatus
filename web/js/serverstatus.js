// serverstatus.js
var error = 0;
var d = 0;
var server_status = new Array();

function timeSince(date) {
	if(date == 0)
		return "从未.";

	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);

	if (interval > 1)
		return interval + " 年前.";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1)
		return interval + " 月前.";
	interval = Math.floor(seconds / 86400);
	if (interval > 1)
		return interval + " 日前.";
	interval = Math.floor(seconds / 3600);
	if (interval > 1)
		return interval + " 小时前.";
	interval = Math.floor(seconds / 60);
	if (interval > 1)
		return interval + " 分钟前.";
	/*if(Math.floor(seconds) >= 5)
		return Math.floor(seconds) + " seconds";*/
	else
		return "几秒前.";
}

function bytesToSize(bytes, precision, si)
{
	var ret;
	si = typeof si !== 'undefined' ? si : 0;
	if(si != 0) {
		var kilobyte = 1000;
		var megabyte = kilobyte * 1000;
		var gigabyte = megabyte * 1000;
		var terabyte = gigabyte * 1000;
	} else {
		var kilobyte = 1024;
		var megabyte = kilobyte * 1024;
		var gigabyte = megabyte * 1024;
		var terabyte = gigabyte * 1024;
	}

	if ((bytes >= 0) && (bytes < kilobyte)) {
		return bytes + ' B';

	} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		ret = (bytes / kilobyte).toFixed(precision) + ' K';

	} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		ret = (bytes / megabyte).toFixed(precision) + ' M';

	} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		ret = (bytes / gigabyte).toFixed(precision) + ' G';

	} else if (bytes >= terabyte) {
		ret = (bytes / terabyte).toFixed(precision) + ' T';

	} else {
		return bytes + ' B';
	}
	if(si != 0) {
		return ret + 'B';
	} else {
		return ret + 'iB';
	}
}

function uptime() {
	$.getJSON("json/stats.json", function(result) {
      
      var shstr = '<div class="col-lg-4 col-md-4 col-sm-4">'+
                       ' <div class="panel panel-block panel-block-sm panel-location">'+
                            '<div class="location-header">'+

                               ' <h3 class="h4"><img src="img/clients/@location.png"> @name <small>@type</small></h3>'+
                             '   <i class="zmdi zmdi-check-circle @online"></i>'+
                         '   </div>'+
                          '  <div class="location-progress">'+
                          '      <div class="progress progress-sm">'+
                             '       <div class="progress-bar" style="width: @load%;"></div>'+
                             '   </div>'+
                          '  </div>'+
                           ' <ul class="location-info list-styled">'+
                           '     <li><span class="list-label"><span style="font-size:20px;" class="lnr lnr-cloud-download"></span>  <span style="font-size:20px;" class="lnr lnr-cloud-upload"></span> <p class="network">@network_rxandnetwork_tx</p></li>'+
                           '     <li><span class="list-label"><span style="font-size:25px;" class="lnr lnr-users"></span> </span> <p class="online">@load%</p></li>'+
                         '   </ul>'+
                      '  </div>'+
                   ' </div>';
      
      var shinnerhtml='';
      
      
		$("#loading-notice").remove();
		if(result.reload)
			setTimeout(function() { location.reload(true) }, 1000);

		for (var i = 0; i < result.servers.length; i++) {
          
          //----kaishi
          
          // Network
				var newnetstr = "";
				if(result.servers[i].network_rx < 1000)
					newnetstr += result.servers[i].network_rx.toFixed(0) + "B";
				else if(result.servers[i].network_rx < 1000*1000)
					newnetstr += (result.servers[i].network_rx/1000).toFixed(0) + "K";
				else
					newnetstr += (result.servers[i].network_rx/1000/1000).toFixed(1) + "M";
				newnetstr += " | "
				if(result.servers[i].network_tx < 1000)
					newnetstr += result.servers[i].network_tx.toFixed(0) + "B";
				else if(result.servers[i].network_tx < 1000*1000)
					newnetstr += (result.servers[i].network_tx/1000).toFixed(0) + "K";
				else
					newnetstr += (result.servers[i].network_tx/1000/1000).toFixed(1) + "M";
        
          
          shinnerhtml+=shstr.replace("@name",result.servers[i].name).replace("@network_rxandnetwork_tx",newnetstr=='NaNM | NaNM'?'Offline':newnetstr).replace("@type",result.servers[i].type).replace("@online",result.servers[i].online4?'text-success':'text-error').replace("@location",result.servers[i].location).replace("@load",result.servers[i].load).replace("@load",result.servers[i].load?result.servers[i].load:0);
          
          
          
          //----jieshu
          
          
          
			var TableRow = $("#servers tr#r" + i);
			var ExpandRow = $("#servers #rt" + i);
			var hack; // fuck CSS for making me do this
			if(i%2) hack="odd"; else hack="even";
			if (!TableRow.length) {
			    var serverhtml='';
			    var serverhtml1 = "<tr id=\"r" + i + "\" data-toggle=\"collapse\" data-target=\"#rt" + i + "\" class=\"accordion-toggle " + hack + "\">" +
						"<td id=\"online4\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"name\">Loading</td>" +
						"<td id=\"type\">Loading</td>" +
						"<!-- td id=\"host\">Loading</td -->" +
						"<td id=\"country\"><div style=\"width: 100%;\"><img src=\"img/clients/@location.png\" height=\"20px\" width=\"35px\" ></div></td>" +
						"<td id=\"location\">Loading</td>" +
						"<td id=\"uptime\">Loading</td>" +
						"<td id=\"load\">Loading</td>" +
						"<td id=\"network\">Loading</td>" +
						"<td id=\"traffic\">Loading</td>" +
						"<td id=\"cpu\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"memory\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"hdd\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
					"</tr>" +
					"<tr class=\"expandRow " + hack + "\"><td colspan=\"12\"><div class=\"accordian-body collapse\" id=\"rt" + i + "\">" +
						"<div id=\"expand_mem\">Loading</div>" +
						"<div id=\"expand_swap\">Loading</div>" +
						"<div id=\"expand_hdd\">Loading</div>" +
						"<div id=\"expand_custom\">Loading</div>" +
					"</div></td></tr>";
				serverhtml += serverhtml1.replace("@location",result.servers[i].host);
				$("#servers").append(serverhtml);
				TableRow = $("#servers tr#r" + i);
				ExpandRow = $("#servers #rt" + i);
				server_status[i] = true;
			}
			TableRow = TableRow[0];
			if(error) {
				TableRow.setAttribute("data-target", "#rt" + i);
				server_status[i] = true;
			}

			// Online4
			if (result.servers[i].online4) {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small><span style='font-size:15px;' class='lnr lnr-bicycle'></span></small>";
			} else {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small><span font-size:15px;' class='lnr lnr-wheelchair'></span></small>";
			}

			// Name
			TableRow.children["name"].innerHTML = result.servers[i].name;

			// Type
			TableRow.children["type"].innerHTML = result.servers[i].type;

			// country
			//var country = result.servers[i].location;
			//TableRow.children["country"].innerHTML = result.servers[i].location;

			// Location
			TableRow.children["location"].innerHTML = result.servers[i].location;
			//TableRow.children["location"].innerHTML = "测试";
			if (!result.servers[i].online4 && !result.servers[i].online6) {
				if (server_status[i]) {
					TableRow.children["uptime"].innerHTML = "–";
					TableRow.children["load"].innerHTML = "–";
					TableRow.children["network"].innerHTML = "–";
					TableRow.children["traffic"].innerHTML = "–";
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["cpu"].children[0].children[0].style.width = "100%";
					TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>Offline</small>";
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["memory"].children[0].children[0].style.width = "100%";
					TableRow.children["memory"].children[0].children[0].innerHTML = "<small>Offline</small>";
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["hdd"].children[0].children[0].style.width = "100%";
					TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>Offline</small>";
					if(ExpandRow.hasClass("in")) {
						ExpandRow.collapse("hide");
					}
					TableRow.setAttribute("data-target", "");
					server_status[i] = false;
				}
			} else {
				if (!server_status[i]) {
					TableRow.setAttribute("data-target", "#rt" + i);
					server_status[i] = true;
				}

				// Uptime
				TableRow.children["uptime"].innerHTML = result.servers[i].uptime;

				// Load
				if(result.servers[i].load == -1) {
					TableRow.children["load"].innerHTML = "–";
				} else {
					TableRow.children["load"].innerHTML = result.servers[i].load;
				}

				// Network
				var netstr = "";
				if(result.servers[i].network_rx < 1000)
					netstr += result.servers[i].network_rx.toFixed(0) + "B";
				else if(result.servers[i].network_rx < 1000*1000)
					netstr += (result.servers[i].network_rx/1000).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_rx/1000/1000).toFixed(1) + "M";
				netstr += " | "
				if(result.servers[i].network_tx < 1000)
					netstr += result.servers[i].network_tx.toFixed(0) + "B";
				else if(result.servers[i].network_tx < 1000*1000)
					netstr += (result.servers[i].network_tx/1000).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_tx/1000/1000).toFixed(1) + "M";
				TableRow.children["network"].innerHTML = netstr;

				//Traffic
				var trafficstr = "";
				if(result.servers[i].network_in < 1024)
					trafficstr += result.servers[i].network_in.toFixed(0) + "B";
				else if(result.servers[i].network_in < 1024*1024)
					trafficstr += (result.servers[i].network_in/1024).toFixed(0) + "K";
				else if(result.servers[i].network_in < 1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_in < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_in/1024/1024/1024/1024).toFixed(2) + "T";
				trafficstr += " | "
				if(result.servers[i].network_out < 1024)
					trafficstr += result.servers[i].network_out.toFixed(0) + "B";
				else if(result.servers[i].network_out < 1024*1024)
					trafficstr += (result.servers[i].network_out/1024).toFixed(0) + "K";
				else if(result.servers[i].network_out < 1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_out < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_out/1024/1024/1024/1024).toFixed(2) + "T";
				TableRow.children["traffic"].innerHTML = trafficstr;

				// CPU
				if (result.servers[i].cpu >= 90)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (result.servers[i].cpu >= 80)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["cpu"].children[0].children[0].style.width = result.servers[i].cpu + "%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = result.servers[i].cpu + "%";

				// Memory
				var Mem = ((result.servers[i].memory_used/result.servers[i].memory_total)*100.0).toFixed(0);
				if (Mem >= 90)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (Mem >= 80)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["memory"].children[0].children[0].style.width = Mem + "%";
				TableRow.children["memory"].children[0].children[0].innerHTML = Mem + "%";
				ExpandRow[0].children["expand_mem"].innerHTML = "内存信息: " + bytesToSize(result.servers[i].memory_used*1024, 2) + " / " + bytesToSize(result.servers[i].memory_total*1024, 2);
				// Swap
				ExpandRow[0].children["expand_swap"].innerHTML = "交换分区: " + bytesToSize(result.servers[i].swap_used*1024, 2) + " / " + bytesToSize(result.servers[i].swap_total*1024, 2);

				// HDD
				var HDD = ((result.servers[i].hdd_used/result.servers[i].hdd_total)*100.0).toFixed(0);
				if (HDD >= 90)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (HDD >= 80)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["hdd"].children[0].children[0].style.width = HDD + "%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = HDD + "%";
				ExpandRow[0].children["expand_hdd"].innerHTML = "硬盘信息: " + bytesToSize(result.servers[i].hdd_used*1024*1024, 2) + " / " + bytesToSize(result.servers[i].hdd_total*1024*1024, 2);

				// Custom
				if (result.servers[i].custom) {
					ExpandRow[0].children["expand_custom"].innerHTML = result.servers[i].custom
				} else {
					ExpandRow[0].children["expand_custom"].innerHTML = ""
				}
			}
		};
      console.log(shinnerhtml);
$('#cards').html(shinnerhtml);
		d = new Date(result.updated*1000);
		error = 0;
	}).fail(function(update_error) {
		if (!error) {
			$("#servers > tr.accordion-toggle").each(function(i) {
				var TableRow = $("#servers tr#r" + i)[0];
				var ExpandRow = $("#servers #rt" + i);
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>Error</small>";
				//TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-error";
				//TableRow.children["online6"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["uptime"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["load"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["network"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["traffic"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["cpu"].children[0].children[0].style.width = "100%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["memory"].children[0].children[0].style.width = "100%";
				TableRow.children["memory"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["hdd"].children[0].children[0].style.width = "100%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>Error</small>";
				if(ExpandRow.hasClass("in")) {
					ExpandRow.collapse("hide");
				}
				TableRow.setAttribute("data-target", "");
				server_status[i] = false;
			});
		}
		error = 1;
		$("#updated").html("更新错误.");
	});
}

function updateTime() {
	if (!error)
		$("#updated").html("最后更新: " + timeSince(d));
}

uptime();
updateTime();
setInterval(uptime, 2000);
setInterval(updateTime, 500);


// styleswitcher.js
function setActiveStyleSheet(title) {
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled)
			return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1	&& a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title"))
			return a.getAttribute("title");
	}
return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ')
			c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}

window.onunload = function(e) {
	var title = getActiveStyleSheet();
	createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
