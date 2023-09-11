const API = 'https://www.dnd5eapi.co/api/'

const content = null || document.getElementById('content');

const options = {
    method : 'GET',
    header :{ 'Accept':'application/json'}
};

async function fetchData(UrlApi){
    const response = await fetch(UrlApi,options);
    const data = await response.json();
    return data;
}

(async () => {
    try{

        // obtengo el array basico de monstruos
        const monsters = await fetchData(API+'/monsters?challenge_rating=10')
        // hago un mapeo del objeto result donde esta el array y dentro declaro una arrow function async para consumir
        // la api nuevamente por cada registro para obtener los datos completos   
        const monsterPromises = monsters.results.map(async (arrayMonsters) => {
                return await fetchData(API+`monsters/${arrayMonsters.index}`);
        });        
    
        // luego uso el Promise all para esperar todos los datos de la peticion antes de continuar
        const monstersInfo = await Promise.all(monsterPromises);

        const monsterImagePromises = monsters.results.map(async (arrayMonsters) => {
            return await fetchData(API+`images/monsters/${arrayMonsters.index}.png`);
        });   
           
        // const monsterImage = await Promise.all(monsterImagePromises);
        let monsterGridView =`${monstersInfo.map( monster => `
        <div class="group relative">
            <div class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
                <img src="" alt="" class="w-full">
            </div>
            <div class="mt-4 flex justify-between">
                <h3 class="text-sm text-gray-700">
                    <span aria-hidden="true" class="absolute inset-0">Nombre:${monster.name}</span>
                </h3>
            </div>
            <div class="mt-4 flex justify-between">
                <h3 class="text-sm text-gray-700">
                    <span aria-hidden="true" class="absolute inset-0">Tamaño:${monster.size}</span>
                </h3>
            </div>
        </div>
        `)}`;
        content.innerHTML = monsterGridView;
    }
    catch(error){
        console.log(error);
    }
})();
