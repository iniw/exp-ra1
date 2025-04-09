# Tutorial
1. Configurar DB

O banco de dados foi exportado para o arquivo 'dq.sql'  através do comando `mysqldump` e contém toda as suas especificações. Executar esse arquivo como um script mysql deixará todas a database e todas as suas tables prontas para uso.

Caso esteja em uma Unix shell, pode executar o script em uma única linha:
```sh
$ mysql -u root < db.sql
```

Caso contrário, pode entrar no terminal mysql e usar o comando `source` para executar o script:
```sh
$ mysql -u root
mysql> source db.sql
```

O servidor conecta com o usuário 'root' do mysql sem usar senha. Se seu usuário root tiver senha é preciso mudar os parâmetros usados na conexão, localizados no arquivo `server/src/main.ts`, linhas 7-12.


2. Rodar servidor (backend)
```sh
$ cd server/
$ npm install
$ npm run dev
```

3. Rodar cliente (frontend)
```sh
$ cd client/
$ npm install
$ npm run dev
```
