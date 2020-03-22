# Simples VideoConf!

Esse projeto foi criado em meio a crise de proliferação do coronavirus no mundo. Muitas empresas, negócios, cultos religiosos estão por decreto impedidos de abrirem, como medida para conter o avanço da pandemia. 

Muitos estão com dúvidas ou dificuldades de como terem uma comunicação remota. Muitas ferramentas existem para esse fim, como Skype, Whatsapp, Google Meeting, etc. Porem ferramentas como Whatsapp não foram desenvolvidas para esse fim (video conferencia), ferramentas como Google Meeting e Skype tem a necessidade de criação de contas.

Não existem serviços simples que não necessitem de contas, login, etc. Acredito que pessoas possam ter dificuldades em criar uma conta no Gmail, ou instalar um Skype.

Minha avó tem dificuldades de instalar um Skype ou um Meeting para participar dos cultos. Por isso, estou criando uma ferramenta muito simples para video conferencia. É tão simples quando acessar um link da internet. Não tem instalação, ou necessidade de criar uma conta, não é necessário fazer um cadastro ou preencher algum formulário. Basta entrar no link e você já esta na conferência.


# Instalação

Estou usando a tecnologia WebRtc para conexão peer-to-peer. É muitos simples de instalar, em menos de 3 minutos você pode ter uma sala dedicada de conferência sem necessidade de uma grande estrutura para isso.

## Requisitos

 - Servidor WEB
 um servidor web para servidor os arquivos HTML, CSS e JAVASCRIPT. Se você possui um site, isso é o essencial.
 - HTTPS
 Por um padrão do WEBRTC, a tecnologia funciona apenas sobre HTTPS.

## instalação

Faça download https://github.com/akaytatsu/videoconference/raw/master/dist/videoconference.zip

Extraia em um diretório local

Edite o arquivo index.html, na linha 23:
```
_ROOM_ID = "COLOQUE_AQUI_UM_CODIGO_UNICO"; //CHANGE HERE WITH UNIQID
```
Altera para um ID unico, por exemplo:
```
_ROOM_ID = "25aa64gh498jwod2fds85847sda76867"; //CHANGE HERE WITH UNIQID
```
Copie o arquivo "index.html" e a pasta "conference" para o diretório do seu servidor onde será o link de acesso.

Agora basta acessar o link e permitir o acesso à câmera e microfone

## Ajuda

O intuito é colaborar para amenizar um pouco os efeitos da pandemia.

Duvidas thiagosistemas3@gmail.com

Deus abençoe a todos.