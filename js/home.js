var currLang = "en";

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

function PopulateLanguageSelector(languages, callback) //add callback to start event listener once populate selector
{
	// console.log(languages);

	var langSelector = document.getElementById("select_language");
	var jsonLangs = JSON.parse(languages.responseText);
	var count = 1;

	// console.log(jsonLangs);
	// console.log(Object.keys(jsonLangs["langs"]).length);	

	Object.keys(jsonLangs["langs"]).forEach(function(key) {

  		var select = document.createElement("option");

  		select.value = count;
  		select.langKey = key;
  		select.textContent = jsonLangs["langs"][key];

  		langSelector.appendChild(select);
  		++count;
	})

}

function GetTranslation(callback)
{	
	var selector = document.getElementById("select_language");

	//get language from selector
	//console.log(selector[selector.value].textContent);

	var langToSet = selector[selector.value].langKey;

	console.log("Translating . . . ");

	//Get Texts to translate
	/*
	var title = document.getElementsByTagName("Title");
	console.log(title[0].innerHTML);
	var titleStr = title[0].innerHTML;

	var headerItems = document.getElementById("navigation");
	console.log(headerItems);

*/
	var content = document.getElementsByTagName("*");
	var id = "*";

	//console.log(bodyContent.textContent);
	var text = content[1].innerHTML;
	text = "hello";

	var translation = new XMLHttpRequest();

	console.log(text);
	/*for content.length 
		make request to translate and store its id
		callback display with id and translation
*/

	translation.onreadystatechange = function(){
		if(translation.readyState == 4 && translation.status == 200)
		{
			console.log("got translation");
			callback(id, translation)
			currLang = langToSet;
		}
		else if(translation.readystate == 4)
		{
			console.log("ERROR" + translation.status);
			alert("ERROR: " + translation.status);
		}
	}

	var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?"
	+ "key=trnsl.1.1.20190304T233940Z.71bf15040bf5e0cd.b8ae71a3cc84ef031bb4ff5ee152f77a7ef8f212" 
	+ "&text=" + text + "&lang=" + currLang + "-" + langToSet + "&format=plain";

	translation.open("GET", url, true);
	translation.send();

}

function DisplayTranslation(id, translation)
{
	console.log(translation);

	var json = JSON.parse(translation.responseText);

	console.log(json);

}
