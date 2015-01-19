#Kit Desenvolvimento IoT

[![NPM](https://nodei.co/npm/kit-iot.png?downloads=true)](https://nodei.co/npm/kit-iot/)

Esse Kit foi desenvolvido pela [Telefonica VIVO](http://www.centrodeinovacaobrasil.com/) para estimular desenvolvedores a entrar no mundo do *"Internet of Things"*.

#Documentação

##Pins utilizados
![Pins utilizados](https://raw.githubusercontent.com/telefonicadigital/kit-iot/master/web/img/arduinoBoard.jpg)
* Push Button - **Digital 3**
* DHT11 (Temperatura e Umidade) - **Digital 2**
* Luminosidade - **Analógico A0**
* Ruido - **Analógico A1**


##Instalação
###MacOS
####Softwares necessários:
* **Arduino** IDE [link](http://arduino.cc/en/Main/Software#toc2)
* **XCode** (com Command Line Tools instalado) [link](https://itunes.apple.com/br/app/xcode/id497799835?mt=12)
* **Node.JS** 0.10 ou superior [link](http://nodejs.org/download/)

###Linux
###Softwares necessários:
* **Arduino** IDE [link](http://arduino.cc/en/Main/Software#toc2)
* Build Essentials:
  * sudo apt-get install **build-essential**
* **Node.JS** 0.10 ou superior [link](http://nodejs.org/download/)

###Windows
**OBS: compatível apenas com o Windows 7 SP1 ou superior!**

####Softwares necessários:
* **Arduino** IDE [link](http://arduino.cc/en/Main/Software#toc2)
* **Visual Studio 2013 Express** ou superior [link](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-2013-express)
* **Node.JS** 0.10 ou superior [link](http://nodejs.org/download/)
* **Python** 2.7.6 ou superior [link](http://www.python.org/download/releases/2.7.6/)


###Depois de instalado
Para instalar o Kit IoT, conecte o cabo usb no computador e na placa arduino e digite no terminal:
```
$ npm install kit-iot -g
```

Para inicia-lo novamente, digite no terminal:
```
$ kit-iot
```

##API Rest
Para acessar as informações do seu Kit utilize a API Rest da nossa cloud. Lembre-se de substituir **{token}** pelo token enviado ao seu email no início do Hackathon.

###GET: services/{token}/
Informações detalhadas do serviço.

**URL**: [http://dca.telefonicabeta.com/m2m/v2/services/{token}/](http://dca.telefonicabeta.com/m2m/v2/services/{token}/)

Exemplo **JSON** de retorno:
```json
{
  "data": {
    "GENERATED_UNIQUE_IDENTIFIER": "mz35b7lee217",
    "acl": {
      "user": "ApplicationManager",
      "description": "Deny All",
      "export": false,
      "subscription": false,
      "command": false,
      "query": false,
      "whiteList": [ ],
      "blackList": [ ],
      "waitingList": [ ],
      "creationTime": "2014-01-24T08:21:25Z"
    },
    "actions": [ ],
    "config": {
      "defaultStats": false,
      "normalizedParams": true,
      "notification": true,
      "qualityOfService": 1,
      "ruleEngine": "",
      "storage": {
        "expiryTime": 1000,
        "measures": true,
        "xml": false
      },
      "status": 1,
      "activate": "1",
      "rushIntervals": [
        3000,
        8000,
        15000
      ],
      "accumulateBy": [ ]
    },
    "creationTime": "2014-01-24T08:21:25Z",
    "description": "mz35b7lee217",
    "legacy": {
      "groupByUC": false
    },
    "name": "mz35b7lee216",
    "organizationId": "mz35b7lee217",
    "updateTime": "2014-01-24T08:21:25Z",
    "stats": {
      "devicesRegistered": 1,
      "trafficMessages": 84037,
      "storageSpaceMB": 11.14
    },
    "appId": 5161
  }
}
```


###GET: services/{token}/assets/{token}/
Retorna informações de um determinado asset de um determinado serviço.

**URL**: [http://dca.telefonicabeta.com/m2m/v2/services/{token}/assets/{token}/](http://dca.telefonicabeta.com/m2m/v2/services/{token}/assets/{token}/)

Exemplo **JSON** de retorno:
```json
{
  "data": {
    "DeviceProps": {
    "commandURL": "http://localhost/",
    "manufacturer": "",
    "model": "",
    "serialNumber": "",
    "version": "",
    "lastIP": "200.158.222.39",
    "commands": true
  },
  "asset": {
    "name": "mz35b7lee217",
    "UserProps": [{
        "name": "nome",
        "value": "Vitor"
      }, {
        "name": "email",
        "value": "vitor@teste.com"
      }, {
        "name": "tel",
        "value": "11942178564"
    }],
    "location": {
      "altitude": "",
      "latitude": "",
      "longitude": ""
    }
  },
  "creationTime": "2014-01-24T08:21:25Z",
  "isConcentrator": false,
  "model": "KITiot",
  "name": "mz35b7lee217",
  "registrationTime": "2014-01-24T08:21:25Z",
  "status": "Active",
  "sensorData": [{
      "st": "2014-09-26T17:23:46Z",
      "ms": {
        "v": 877,
        "p": "sound",
        "u": "cubicMeter"
      }
    }, {
      "ms": {
        "v": 27,
        "p": "temperature",
        "u": "kelvin"
      },
      "st": "2014-09-26T17:23:46Z"
    }, {
      "st": "2014-09-26T17:23:46Z",
      "ms": {
        "v": 36,
        "p": "relativeHumidity",
        "u": "dimensionless"
      }
    }, {
      "st": "2014-09-26T17:23:46Z",
      "ms": {
        "v": 0,
        "p": "amount",
        "u": "unit"
      }
    }, {
      "st": "2014-09-26T17:23:46Z",
      "ms": {
        "v": 679,
        "p": "luminousIntensity",
        "u": "candela"
      }
    }]
  }
}
```


###GET: services/{token}/assets/{token}/data/
Retorna o histórico de dados recebidos de um determinado asset de um determinado serviço.

**URL**: [http://dca.telefonicabeta.com/m2m/v2/services/{token}/assets/{token}/data/](http://dca.telefonicabeta.com/m2m/v2/services/{token}/assets/{token}/data/)
**parametros**
* **limit** *opcional
  * Total de registros para retornar por página. Caso não seja especificado, a API retornará todos os dados recebidos
* **sortBy** *opcional
  * Ordena os dados (ascendente ou descendente) utilizando o campo informado. Os campos disponíveis são: assetName, assetType, ou registrationTime.
    * Exemplos:
      * sortBy=registrationTime
      * sortBy=!registrationTime

Exemplo **JSON** de retorno:
```json
{
  "data": [{
    "st": "2014-03-13T18:30:04Z",
    "ms": {
      "v": 695,
      "p": "luminousIntensity",
      "u": "candela"
    },
    "pms": [{
      "v": "1",
      "p": "QoS",
      "u": ""
    }]
  }],
  "asset": "mz35b7lee217",
  "count": 84037
}
```
