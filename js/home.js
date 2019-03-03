function Init()
{
	console.log("Initializing");
	GetNews(DisplayNews);
	GetLanguages(PopulateLanguageSelector);
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

function GetLanguages(callback)
{
	console.log("Getting Languages");

	var languages = new XMLHttpRequest();

	languages.onreadystatechange = function(){
		if(languages.readyState == 4 && languages.status == 200)
		{
			console.log("Recieved Languages");
			callback(languages);
		}
	};
	var url = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1."
	+ "20190303T213644Z.3f24f2e041cad1bc.e96607b3c87a2db72c9ea095ac7b6c93ca985085&ui=en";

	languages.open("GET", url, true);
	languages.send();	
}

function PopulateLanguageSelector(languages)
{
	console.log(languages);

	var langSelector = document.getElementById("select_language");
	var jsonLangs = JSON.parse(languages.responseText);
	var count = 0;

	console.log(jsonLangs);
	console.log(jsonLangs["langs"]);	

	Object.keys(jsonLangs["langs"]).forEach(function(key) {
  		console.log('Key : ' + key + ', Value : ' + jsonLangs["langs"][key])
  		var select = document.createElement("option");

  		select.value = count;
  		select.textContent = jsonLangs["langs"][key];

  		langSelector.appendChild(select);
  		++count;
	})
}

