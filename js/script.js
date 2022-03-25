
const API_KEY='befce9fd53c04bb695e30568399296c0';

const choicesElem=document.querySelector('.js-choices');

const newsList=document.querySelector('.news-list');

const formSearch=document.querySelector('.form-search');

const title=document.querySelector('.title');



const choices=new Choices(choicesElem,{
    searchEnabled:false,
    itemSelectText:'',

});
const wasFound=document.querySelector('.was-found');
const numValue=document.querySelector('.num-value');
const endingValue=document.querySelector('.ending-value');

console.log(numValue.textContent);

if(numValue.textContent>=2 && numValue.textContent<=4){
endingValue.innerHTML='а';
wasFound.textContent='о';
}
else if(numValue.textContent>=5){
endingValue.innerHTML='ов';
wasFound.textContent='о';
}
else if(numValue.textContent==1)
wasFound.textContent='';
else if(numValue.textContent==0){
wasFound.textContent='о';
endingValue.innerHTML='ов';
}

const getData=async (url)=>{
    const response= await fetch(url,{
        method:'GET',
        headers:{
           
        }
    });
    const data= await response.json();
    return data;
};

const getDateCorrectFormat=isoDate=>{

   const date=new Date(isoDate);
   const fullDate=date.toLocaleString('en-GB',{
       year:'numeric',
       month:'numeric',
       day:'numeric'
   });
   const fullTime=date.toLocaleString('en-GB',{
    hour:'numeric',
    minute:'numeric'
});
   return `<span class="news-date">${fullDate}</span> ${fullTime}`
}

const getImage=url=>new Promise((resolve)=>{
const image=new Image(270,200);
image.addEventListener('load',()=>{
    resolve(image); 
});

image.addEventListener('error',()=>{
    image.src='../images/no-photo.jpg';
    resolve(image);
});

image.src= url|| '../images/no-photo.jpg';
image.className='news-image';
return image;
})


const renderCard= (data)=>{
newsList.textContent= '';

data.forEach( async news=>{
    const card=document.createElement('li');
    card.className='news-item';

    const image=await getImage(news.urlToImage);
    image.alt=title;
    card.append(image);

    card.innerHTML+=`
   
    <a href="${news.url}" class="news-link" target="_blank">
        <h3>${news.title || ''}</h3>
    </a>
    <p class="news-description">${news.description}</p>
    
    <div class="news-footer">
        <time class="news-datetime"${getDateCorrectFormat(news.publishedAt)}
           
        </time>
        <div class="news-author">${news.author || news.source.name || ''}</div>
    </div>
    `;
    newsList.append(card);
    
})



}

const loadNews=async (country)=>{
    title.classList.add('hide');
    newsList.innerHTML='<li class="preload"></li>';

    if(!country){
        country=localStorage.getItem("country")|| 'ru';
        
    }
    choices.setChoiceByValue(country);

    const data=await getData(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100&category=sports&apiKey=befce9fd53c04bb695e30568399296c0`);
    
    renderCard(data.articles); 
    console.log(data.articles);
}

const loadSearch=async value=>{
    choices.setChoiceByValue('');
    const data=await getData(`https://newsapi.org/v2/everything?q=${value}&pageSize=100&apiKey=befce9fd53c04bb695e30568399296c0`);
    title.classList.remove('hide');
    title.innerHTML=`По вашему запросу "${value}" найдено ${data.articles.length}  результатов`
    renderCard(data.articles); 
};

choicesElem.addEventListener('change',(e)=>{
    const value=e.detail.value;
    loadNews(value);
    localStorage.setItem('country',value);
})

formSearch.addEventListener('submit',(e)=>{
    e.preventDefault();
    loadSearch(formSearch.search.value);
    
    formSearch.reset();
})

loadNews();

