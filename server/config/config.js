process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = "mongodb+srv://caguilard:Bmas.sigma.2021@cluster0.hcvmf.mongodb.net/bootcamp?retryWrites=true&w=majority";
}
else{
    urlDB = "mongodb+srv://caguilard:Bmas.sigma.2021@cluster0.hcvmf.mongodb.net/bootcamp?retryWrites=true&w=majority";
}

process.env.urlDB = urlDB;

process.env.SEED = process.env.SEED || 'Firma-Secreta';

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '8h';