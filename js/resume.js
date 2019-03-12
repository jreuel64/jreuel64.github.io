var currLang = "en";

function Init()
{
	console.log("Initializing");
	GetResume(DisplayResume);
	GetLanguages(PopulateLanguageSelector);
}

function GetResume(callback)
{
	var resume = new XMLHttpRequest();

	resume.onreadystatechange = function(){
		if(resume.readyState == 4 && resume.status == 200)
		{
			console.log("Recieved resume");
			callback(resume);
		}
	};

	var url = "https://jreuel64.github.io/js/resume.json";

	resume.open("GET", url, true);
	resume.send();
}

function DisplayResume(resume)
{
	//console.log(resume);

	var jsonResume = JSON.parse(resume.responseText);

	//console.log(jsonResume[0].section);

	//populate resume
	for(var i = 0; i < jsonResume.length; ++i)
	{
		var resumeField = document.getElementById("resume_content");

	//create section
		//create section title
		var header = document.createElement("h2");
		header.id = "header" + i;
		header.className = "translatable";
		header.textContent = jsonResume[i].section;

		resumeField.appendChild(header);

		//create content div
		var div = document.createElement("div");
		div.className="resumeP";

		//add items to paragraph
		for(var j = 0; j < jsonResume[i].content.length; ++j)
		{
			//console.log(jsonResume[i].content[j].item + j)
			var item = jsonResume[i].content[j].item;
			var date = jsonResume[i].content[j].date;
			var description = jsonResume[i].content[j].description;
			var linkSrc = jsonResume[i].content[j].link;

			//add item
			var itemP = document.createElement("p");
			itemP.id = "itemP" + i + "." + j;
			itemP.className = "translatable";
			itemP.innerHTML = item + "</br>";

			var descriptionP = document.createElement("p");
			descriptionP.style.marginLeft="35rem";

			//add description 
			if(description != ""){
				var span1 = document.createElement("span");
				span1.id = "span1" + i + "." + j;
				span1.className = "translatable";
				span1.innerHTML = description;

				descriptionP.appendChild(span1);
				descriptionP.innerHTML += "</br>"
			}
			//add date
			if(date != ""){
				var span2 = document.createElement("span");
				span2.id = "span2" + i + "." + j;
				span2.className = "translatable";
				span2.innerHTML = "Date:  " + date;

				descriptionP.appendChild(span2);
				descriptionP.innerHTML += "</br>";
			}
			//add link
			if(linkSrc != ""){
				var link = document.createElement("a");
				link.className="resumeLink";
				link.textContent = linkSrc;
				link.href=linkSrc;

				descriptionP.appendChild(link);
			}

			div.appendChild(itemP)
			div.appendChild(descriptionP);
		}

		resumeField.appendChild(div);
	}
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
	+ "&text=" + toTranslate + "&lang=" + currLang + "-" + langToSet + "&format=html";

		RequestTranslation(id, langToSet, url, DisplayTranslation);
	}
}

function RequestTranslation(id,langToSet, url, callback)
{
	var translation = new XMLHttpRequest();

	translation.onerror = function(){
		console.log("ERROR");
	}


	translation.onreadystatechange = function(){
		if(translation.readyState == 4 && translation.status == 200)
		{
			callback(id, translation)
			currLang = langToSet;
		}
		else if(translation.readystate == 4 )
		{
			console.log("ERROR" + translation.status);
			//alert("ERROR: " + translation.status);
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
