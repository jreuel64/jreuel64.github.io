function Init()
{
	console.log("Initializing");
	GetNews(DisplayNews);
}

function GetNews(callback)
{
	console.log("Getting News");

	var news = new XMLHttpRequest();

	news.onreadystatechange = function(){
		if(news.readyState == 4 && news.status == 200)
		{
			console.log("Recieved News");
			callback(news);
		}
	};

	var url = "https://jreuel64.github.io/js/recent_news.json";

	news.open("GET", url, true);
	news.send();
}

function DisplayNews(news)
{
	var newsField = document.getElementById("news");
	var jsonNews = JSON.parse(news.responseText);

	//Create Table
	var table = document.createElement("table");
	for(var i = 0; i < jsonNews["news"].length; ++i)
	{
		//create table row
		var row = document.createElement("tr");

		//create table cells
		var data1 = document.createElement("td");
		var data2 = document.createElement("td");

		//set content of table cells
		data1.textContent = jsonNews["news"][i].date;
		data2.textContent = jsonNews["news"][i].event;

		//push cells to current row
		row.appendChild(data1);
		row.appendChild(data2);

		//push row onto table
		table.appendChild(row);
	}

	//push table to news field
	newsField.appendChild(table);
}

