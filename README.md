#Kit Desenvolvimento IoT [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM](https://nodei.co/npm/kit-iot.png?downloads=true)](https://nodei.co/npm/kit-iot/)

Esse kit foi desenvolvido para estimular desenvolvedores a entrar no mundo do *"Internet of Things"*

#Instalando pela primeria vez
A lib [PM2](https://github.com/Unitech/pm2) é utilizada para iniciar o serviço sempre que reinicia a placa.

Para gerar o daemon da aplicação:
```
$ cd kit-iot
$ pm2 start index.js --name kit-iot
$ pm2 startup ubuntu
$ pm2 dump
```
Agora a aplicação vai reestartar sempre que acontecer o boot na placa.

#Saiba mais
Para mais informações sobre o kit e documentação visite o site [iot.telefonicabeta.com](iot.telefonicabeta.com)
