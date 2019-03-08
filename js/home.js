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

		//create spans
		var span1 = document.createElement("span");
		var span2 = document.createElement("span");

		span1.className = "translatable";
		span2.className = "translatable";
		span1.id = "td" + i + "_" + "1";
		span2.id = "td" + i + "_" + "2";

		span1.textContent = jsonNews["news"][i].date;
		span2.textContent = jsonNews["news"][i].event;

		//set content of table cells
		data1.appendChild(span1);
		data2.appendChild(span2);

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

	//add English at the top
	var enSelect = document.createElement("option");
	enSelect.value = 0;
	enSelect.langKey="en";
	enSelect.textContent = "English";

	langSelector.appendChild(enSelect);

	//populate rest of languages
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
	console.log("Translating " + currLang + " - " + langToSet);	


	var translatable = document.getElementsByClassName("translatable");

	//console.log(translatable);

	for(var i = 0; i < translatable.length; ++i)
	{
		var toTranslate = translatable[i].textContent;
		var id = translatable[i].id;

		var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?"
	+ "key=trnsl.1.1.20190304T233940Z.71bf15040bf5e0cd.b8ae71a3cc84ef031bb4ff5ee152f77a7ef8f212" 
	+ "&text=" + toTranslate + "&lang=" + currLang + "-" + langToSet + "&format=plain";

		RequestTranslation(id, langToSet, url, DisplayTranslation);
	}
}

function RequestTranslation(id,langToSet, url, callback)
{
	var translation = new XMLHttpRequest();

	translation.onreadystatechange = function(){
		if(translation.readyState == 4 && translation.status == 200)
		{
			//console.log("got translation");
			callback(id, translation)
			currLang = langToSet;
		}
		else if(translation.readystate == 4)
		{
			console.log("ERROR" + translation.status);
			alert("ERROR: " + translation.status);
		}
	}

	translation.open("GET", url, true);
	translation.send();


}

function DisplayTranslation(id, translation)
{
	var json = JSON.parse(translation.responseText);


	var field = document.getElementById(id);
	field.textContent = json.text;

}
