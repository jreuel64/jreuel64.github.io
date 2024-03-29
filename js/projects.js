var currLang = "en";

function Init()
{
	console.log("Initializing");
	GetProjects(DisplayProjects);
	GetLanguages(PopulateLanguageSelector);
}

function GetProjects(callback)
{
	console.log("Getting projects");

	var projects = new XMLHttpRequest();

	projects.onreadystatechange = function(){
		if(projects.readyState == 4 && projects.status == 200)
		{
			console.log("Recieved Projects");
			callback(projects);
		}
	};

	var url = "https://jreuel64.github.io/js/projects.json";

	projects.open("GET", url, true);
	projects.send();
}

function DisplayProjects(projects)
{
	console.log(projects);
	var lbField = document.getElementById("lightboxes");
	var json = JSON.parse(projects.responseText);

	console.log(json[0].images.length);

	var i;
	for(i = 0; i < json.length; ++i)
	{
		//create lb(i)
			//div
			console.log("creating lb" + i);
			var div = document.createElement("div");
			div.className="lb";
			div.id="lb" + i;

			//close button
			var closeButton = document.createElement("a");
			closeButton.id="closeButton";
			closeButton.innerHTML="&times;";
			closeButton.dataset.num = i;
			closeButton.addEventListener("click", function(){
				CloseLightBox(this.dataset.num);
			});

			div.appendChild(closeButton);

			//prev button
			var prevButton = document.createElement("a");
			prevButton.id="prev";
			prevButton.className="scroll";
			prevButton.innerHTML="&lt;";
			prevButton.dataset.num = i;
			prevButton.addEventListener("click", function(){
				ChangeSlides(-1,this.dataset.num);
			});

			div.appendChild(prevButton);

			//next button
			var nextButton = document.createElement("a");
			nextButton.id="next";
			nextButton.className="scroll";
			nextButton.innerHTML="&gt;";
			nextButton.dataset.num = i;
			nextButton.addEventListener("click", function(){
				ChangeSlides(1,this.dataset.num);
			});

			div.appendChild(nextButton);

			//add thumbnail images
			var table = document.getElementById("projects_table");

			var tr = document.createElement("tr");
			var titleCell = document.createElement("td");
			var thumbnailCell = document.createElement("td");

			titleCell.id = "titleCell" + i;
			titleCell.className = "translatable";
			titleCell.textContent=json[i].title;

			var projectId = i;
			var thumbimg = document.createElement("img");
			thumbimg.id = projectId;
			thumbimg.className = "lbImg";
			thumbimg.src = json[i].images[0];
			thumbimg.alt = json[i].images[0];
			thumbimg.title = json[i].images[0];

			thumbimg.addEventListener("click", function() {
				console.log(this.getAttribute("id"));
				OpenLightBox(this.getAttribute("id"));
			});


			thumbnailCell.appendChild(thumbimg);

			tr.appendChild(titleCell);
			tr.appendChild(thumbnailCell);

			table.appendChild(tr);

			//slide images
			for(var j = 1; j < json[i].images.length; ++j)
			{
				var imgPath = json[i].images[j];

				//create image 
				var img = document.createElement("img");
				img.src = imgPath;
				img.alt = imgPath;
				img.title = imgPath;

				div.appendChild(img);
			}

			//title
			var title = document.createElement("h2");
			title.className = "title";
			var titleSpan = document.createElement("span");
			titleSpan.id = "title"+i;
			titleSpan.className = "translatable";
			titleSpan.textContent = json[i].title;


			title.appendChild(titleSpan);

			div.appendChild(title);

			//description
			var description = document.createElement("p");
			description.className = "description";
			var descrSpan = document.createElement("span");
			descrSpan.id = "description" + i;
			descrSpan.className = "translatable";
			descrSpan.textContent = json[i].description;

			description.appendChild(descrSpan);
			div.appendChild(description);

			lbField.appendChild(div);
	}

	console.log(lbField);
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

	var langToSet = selector[selector.value].langKey;
	console.log("Translating " + currLang + " - " + langToSet);	


	var translatable = document.getElementsByClassName("translatable");

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


var slideIndex = 0;

function OpenLightBox(lbNum)
{	
	slideIndex = 0;
	var lb = "lb" + lbNum;

	document.getElementById(lb).style.display = "block";

	ShowSlides(lbNum);
}

function CloseLightBox(lbNum)
{
	var lb = "lb" + lbNum;

	document.getElementById(lb).style.display = "none";
}

function ChangeSlides(n, lbNum)
{
	slideIndex += n;
	ShowSlides(lbNum);
}

function ShowSlides(lbNum)
{
	var lb = "lb" + lbNum;
	var lightbox = document.getElementById(lb);

	var slides = lightbox.getElementsByTagName("img");

	//remove old slideFraction
	var frac = document.getElementsByClassName("slideFraction");
	if(frac.length != 0)
	{
		frac[0].parentNode.removeChild(frac[0]);
	}

	//wrap slides around the ends
	if(slideIndex > slides.length-1)
	{
		slideIndex = 0;
	}
	if(slideIndex < 0)
	{
		slideIndex = slides.length - 1;
	}

	//create new slideFraction
	var slideFrac = document.createElement("p");
	slideFrac.className="slideFraction";

	slideFrac.textContent = (slideIndex+1) + " / " + (slides.length);
	lightbox.appendChild(slideFrac);

	//make all slides invisible
	for( var i = 0; i < slides.length; ++i)
	{
		slides[i].style.display = "none";
	}

	//set current slide visible
  	slides[slideIndex].style.display = "block";
}