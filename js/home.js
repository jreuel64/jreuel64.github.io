function Init()
{
	console.log("Initializing");
	//GetNews(DisplayNews);
}

function GetNews(callback)
{
	console.log("Getting News");

	var news = new XMLHttpRequest();

	news.onreadystatechange = funtion(){
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

function DisplayNews(news);
{
	var newsField = document.getElementById("news");
	var jsonNews = JSON.parse(news.responseText());

	console.log(newsField);
	console.log(jsonNews);
}